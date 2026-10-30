  /* ==================================================================
     w1: 4.1, 4.2, 4.3 widgetjei (matvec, walk-distribution, power-iteration)
     ================================================================== */
  {
    /* tört alak kis nevezővel (ha van), különben tizedes tört */
    function frac(x, maxDen = 144) {
      if (Math.abs(x) < 1e-12) return "0";
      for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return q === 1 ? String(p) : p + "/" + q; }
      return fmt(x, 3);
    }
    const inkFor = t => (t > 0.55 ? "#ffffff" : "--text");
    /* kis vonaldiagram SVG-ben: vals (pozitív számok), log skálán is */
    function spark(vals, { w = 300, h = 70, log = false, label = "" } = {}) {
      if (vals.length < 2) return "";
      const ys = vals.map(v => (log ? Math.log10(Math.max(v, 1e-12)) : v));
      const lo = log ? Math.max(Math.min(...ys), -12) : 0, hi = Math.max(...ys), sp = hi - lo || 1;
      const pts = ys.map((y, i) => `${(6 + i * (w - 12) / (ys.length - 1)).toFixed(1)},${(h - 14 - (Math.max(y, lo) - lo) / sp * (h - 24)).toFixed(1)}`).join(" ");
      return `<svg viewBox="0 0 ${w} ${h}" width="100%" style="max-width:${w}px;display:block">
        <line x1="6" y1="${h - 14}" x2="${w - 6}" y2="${h - 14}" stroke="var(--border)"/>
        <polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="2"/>
        <text x="6" y="${h - 2}" font-size="10" fill="var(--muted)">${label}</text></svg>`;
    }
    function graphFor(key, aspect) {
      const G = preset(key, aspect);
      return G;
    }

    /* ------------------------------------------------------------------
       4.1  matvec – szomszédösszeg és szomszédátlag
       ------------------------------------------------------------------ */
    W["matvec"] = root => {
      header(root, "Add össze a szomszédaidat: $A\\mathbf x$ és $D^{-1}A\\mathbf x$",
        "Kattints egy csúcsra, és a <b>+1 / −1</b> gombokkal állítsd az értékét (a csúcs melletti szám). A táblázat csúcsonként mutatja, melyik szomszédok értéke adódik össze. " +
        "Az „Alkalmazd újra” gomb az eredményt teszi az új $\\mathbf x$-be: figyeld meg, hogy az összeg nő, az átlag simít.");
      math(root);
      const START = { path4: [5, 1, 2, 4], barat: [1, 2, 3, 4], arviz: [1, 1, 0, 0, 0, 1, 0] };
      let key = "path4", mode = "sum", G, x = [], sel = -1, k = 0;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      toggleGroup(ctr, [["path4", "4 csúcsú út"], ["barat", "barátsággráf"], ["arviz", "Árvízhét (hétfő)"]], key, v => { key = v; load(); });
      toggleGroup(ctr2, [["sum", "összeg: A·x"], ["avg", "átlag: D⁻¹A·x"]], mode, v => { mode = v; paint(); });
      const ctr3 = h("div", { class: "controls" });
      root.append(ctr3);
      ctr3.append(btn("+1", () => bump(1)), btn("−1", () => bump(-1)), btn("mind 1", () => { x = x.map(() => 1); k = 0; paint(); }),
        btn("nullázás", () => { x = x.map(() => 0); k = 0; paint(); }), btn("Alkalmazd újra ↻", () => { x = result(); k++; paint(); }), btn("Kezdőérték", () => load()));
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect: 0.42, radius: 17, onNodeClick: i => { sel = sel === i ? -1 : i; paint(); } });
      const tbl = h("div", { class: "tw", style: "overflow-x:auto" }), read = h("div", { class: "readout" });
      root.append(tbl, read);
      function bump(d) { if (sel < 0) { read.innerHTML = "Előbb kattints egy csúcsra!"; return; } x[sel] = +(x[sel] + d).toFixed(6); k = 0; paint(); }
      function result() {
        const A = adjM(G.nodes.length, G.edges), s = matVec(A, x), d = rowSums(A);
        return mode === "sum" ? s : s.map((v, i) => (d[i] ? v / d[i] : 0));
      }
      function load() {
        const asp = key === "path4" ? 0.2 : 0.42;
        G = graphFor(key, asp); x = START[key].slice(); sel = -1; k = 0;
        if (key === "path4") G.nodes.forEach(nd => (nd.y = 0.5));
        else G.nodes.forEach(nd => { if (nd.sub) nd.y = 0.06 + nd.y * 0.86; });
        if (view.o.aspect !== asp) { view.o.aspect = asp; view.resize(); }
        paint();
      }
      function paint() {
        const n = G.nodes.length, A = adjM(n, G.edges), d = rowSums(A), y = result();
        const mx = Math.max(1e-9, ...x.map(Math.abs));
        const nb = i => [...Array(n).keys()].filter(j => A[i][j]);
        view.setGraph(G.nodes.map((nd, i) => {
          const t = Math.abs(x[i]) / mx;
          return { ...nd, color: x[i] ? mixColor("--card", x[i] > 0 ? "--accent" : "--setA", 0.15 + 0.7 * t) : null, ink: x[i] ? inkFor(t) : null, badge: fmt(x[i], 2) };
        }), G.edges.map(e => ({ ...e, w: 1 })));
        view.sel = sel; view.hl = new Set(sel >= 0 ? nb(sel) : []); view.dim = sel >= 0;
        view.hlE = new Set(sel >= 0 ? nb(sel).map(j => GK.edgeKey(sel, j)) : []);
        view.draw();
        const L = i => G.nodes[i].label;
        const lab = i => (L(i) === "Ön" ? "\\text{Ön}" : /^[A-Z][a-z]$/.test(L(i)) ? `\\mathrm{${L(i)}}` : L(i));
        tbl.innerHTML = `<table><tr><th>csúcs</th><th>$x_i$</th><th>szomszédok</th><th>${mode === "sum" ? "$(A\\mathbf x)_i$" : "$(D^{-1}A\\mathbf x)_i$"}</th></tr>` +
          G.nodes.map((nd, i) => {
            const terms = nb(i).map(j => fmt(x[j], 2)).join(" + ") || "0";
            const f = mode === "sum" ? `${terms} = <b>${fmt(y[i], 2)}</b>` : `(${terms}) / ${d[i]} = <b>${fmt(y[i], 2)}</b>`;
            return `<tr${i === sel ? ' style="background:var(--bg-soft)"' : ""}><td>$${lab(i)}$</td><td>${fmt(x[i], 2)}</td><td>${nb(i).map(j => `$${lab(j)}$`).join(", ")}</td><td>${f}</td></tr>`;
          }).join("") + "</table>";
        const sx = x.reduce((a, b) => a + b, 0), sy = y.reduce((a, b) => a + b, 0);
        const spread = v => Math.max(...v) - Math.min(...v);
        let t = `Ismétlések száma: <b>${k}</b>. $\\sum x_i = ${fmt(sx, 2)}$, az eredmény összege ${fmt(sy, 2)}; terjedelem (max − min): ${fmt(spread(x), 2)} → ${fmt(spread(y), 2)}.`;
        if (x.every(v => v === 1)) t += mode === "sum" ? "<br>A csupa 1 vektorból a <b>fokszámok</b> lettek: $A\\mathbf 1 = \\mathbf d$." : "<br>A konstans vektort az átlagolás nem változtatja meg: $D^{-1}A\\mathbf 1 = \\mathbf 1$.";
        if (sel >= 0) t += `<br>A kijelölt $${lab(sel)}$ szomszédai kiemelve. Saját értéke (${fmt(x[sel], 2)}) <b>nem</b> számít bele az eredményébe.`;
        if (k >= 3) t += mode === "sum" ? "<br>Az összeg ismételve egyre nő: $A^k\\mathbf x$ – a 4.3-ban normálni fogjuk." : "<br>Az átlagolás ismételve simít: az értékek közelednek egymáshoz (4.4).";
        read.innerHTML = t;
        math(tbl); math(read);
      }
      load();
    };

    /* ------------------------------------------------------------------
       4.2  walk-distribution – az eloszlás lépésről lépésre
       ------------------------------------------------------------------ */
    W["walk-distribution"] = root => {
      header(root, "Véletlen séta lépésről lépésre: $\\mathbf p_{t+1}^\\top = \\mathbf p_t^\\top P$",
        "Kattints egy csúcsra: onnan indul az olvasó ($\\mathbf p_0$). A <b>Lépés</b> gombbal szorozd meg az eloszlást $P$-vel. A csúcs színe és száma: mekkora eséllyel van ott; az oszlopok mellett a stacionárius $\\pi_i = d_i/2m$. " +
        "Próbáld ki a csillagot (páros gráf!), a lusta sétát, és a lapok irányított hivatkozási gráfját.");
      math(root);
      let key = "barat", lazy = false, G, n, P, pi, p, t = 0, start = 0, hist = [];
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      toggleGroup(ctr, [["barat", "barátsággráf"], ["star", "csillag"], ["path4", "4 csúcsú út"], ["arviz", "Árvízhét"], ["papers", "lapok (irányított)"]], key, v => { key = v; load(); });
      const lazyCb = h("input", { type: "checkbox", onchange: () => { lazy = lazyCb.checked; build(); reset(); } });
      ctr2.append(btn("Lépés ▶", () => step(1)), btn("+10 lépés", () => step(10)), btn("Vissza t = 0", () => reset()), h("label", null, lazyCb, " lusta séta (½ eséllyel helyben marad)"));
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect: 0.45, radius: 17, onNodeClick: i => { start = i; reset(); } });
      const bars = h("div"), chart = h("div"), read = h("div", { class: "readout" });
      root.append(bars, chart, read);
      function build() {
        const A = adjM(n, G.edges, { directed: !!G.directed });
        const d = rowSums(A);
        P = A.map((r, i) => (d[i] ? r.map(a => a / d[i]) : r.map((_, j) => +(i === j))));      // zsákutca: ott marad (beragad)
        if (lazy) P = P.map((r, i) => r.map((a, j) => a / 2 + (i === j ? 0.5 : 0)));
        if (G.directed) { pi = null; return; }
        const s = d.reduce((a, b) => a + b, 0);
        pi = d.map(v => v / s);
      }
      function load() {
        G = graphFor(key, 0.45); n = G.nodes.length; G.edges = G.edges.map(e => ({ ...e, w: 1 }));
        G.nodes.forEach(nd => { if (nd.sub) nd.y = 0.06 + nd.y * 0.86; });
        start = key === "barat" ? 3 : key === "arviz" ? 6 : key === "papers" ? 3 : 0;
        build(); reset();
      }
      function reset() { p = new Array(n).fill(0); p[start] = 1; t = 0; hist = [tv()]; paint(); }
      function tv() { return pi ? 0.5 * p.reduce((s, v, i) => s + Math.abs(v - pi[i]), 0) : null; }
      function step(k) { for (let s = 0; s < k; s++) { p = vecMat(p, P); t++; hist.push(tv()); } paint(); }
      function paint() {
        const mx = Math.max(...p);
        view.o.directed = !!G.directed;
        view.setGraph(G.nodes.map((nd, i) => {
          const u = mx ? p[i] / mx : 0;
          return { ...nd, color: p[i] > 1e-9 ? mixColor("--card", "--accent", 0.12 + 0.78 * u) : null, ink: p[i] > 1e-9 ? inkFor(u) : null,
            badge: p[i] < 1e-9 ? "0" : n <= 4 && t <= 12 ? frac(p[i]) : fmt(p[i], 3) };
        }), G.edges);
        view.sel = start; view.draw();
        const L = i => G.nodes[i].label;
        bars.innerHTML = `<div style="display:grid;grid-template-columns:auto 1fr auto;gap:.25rem .5rem;align-items:center;font-size:.9rem;margin-top:.5rem">` +
          G.nodes.map((nd, i) => `<span><b>${L(i)}</b></span>
            <div style="position:relative;height:16px;background:var(--bg-soft);border-radius:4px">
              <div style="position:absolute;left:0;top:0;bottom:0;width:${(100 * p[i]).toFixed(2)}%;background:var(--accent);border-radius:4px;opacity:.85"></div>
              ${pi ? `<div title="π" style="position:absolute;top:-2px;bottom:-2px;left:calc(${(100 * pi[i]).toFixed(2)}% - 1px);width:2px;background:var(--text)"></div>` : ""}
            </div><span style="font-family:var(--mono)">${fmt(100 * p[i], 1)}%${pi ? ` <span class="muted">(π ${fmt(100 * pi[i], 1)}%)</span>` : ""}</span>`).join("") + "</div>";
        chart.innerHTML = pi && hist.length > 2 ? spark(hist, { log: true, label: "eltérés π-től (½·Σ|p − π|), logaritmikus skálán, t = 0 … " + t }) : "";
        let txt = `$t = ${t}$, kezdés: <b>${L(start)}</b>.`;
        if (pi) {
          const e = hist[hist.length - 1];
          txt += ` Eltérés a stacionárius eloszlástól: <b>${fmt(e, 4)}</b>.`;
          const osc = t >= 6 && Math.abs(hist[t] - hist[t - 2]) < 1e-9 && Math.abs(hist[t] - hist[t - 1]) > 1e-6 && e > 1e-3;
          if (osc) txt += `<br>⚠️ Az eloszlás <b>oszcillál</b>: két állapot között ugrál, nem tart $\\boldsymbol\\pi$-hez. A gráf páros – kapcsold be a lusta sétát!`;
          else if (e < 1e-3 && t > 0) txt += `<br>✓ Beállt: $\\mathbf p_t \\approx \\boldsymbol\\pi$, a fokszámmal arányos eloszlás.`;
        } else {
          const sinks = G.nodes.map((_, i) => i).filter(i => !G.edges.some(e => e.a === i));
          txt += ` Irányított gráf: a $d_i/2m$ képlet itt nem érvényes. A zsákutcában (${sinks.map(L).join(", ")}) a séta <b>beragad</b> – ott ${fmt(100 * sinks.reduce((s, i) => s + p[i], 0), 1)}% a valószínűség.`;
          if (t >= 3) txt += "<br>Hosszú távon minden valószínűség a zsákutcában gyűlik össze. A PageRank teleportálással segít ezen (5. fejezet).";
        }
        if (lazy) txt += "<br>Lusta séta: $P' = \\tfrac12(I + P)$ – ugyanaz a $\\boldsymbol\\pi$, de páros gráfon is konvergál.";
        read.innerHTML = txt; math(read);
      }
      load();
    };

    /* ------------------------------------------------------------------
       4.3  power-iteration – szorozd, normáld, ismételd
       ------------------------------------------------------------------ */
    W["power-iteration"] = root => {
      header(root, "Hatványiteráció: szorozd, normáld, ismételd",
        "Nyomd a <b>Lépés</b> gombot: minden csúcs összeadja a szomszédai értékét, aztán az egészet elosztjuk (a legnagyobb elemmel, az összeggel vagy a hosszal). " +
        "A csúcs színe és száma az értéke. A táblázat az utolsó lépéseket, a görbe az eltérést mutatja a valódi sajátvektortól. A csillagon figyeld meg az oszcillációt, és javítsd ki az $A + I$ kapcsolóval!");
      math(root);
      let key = "paw", norm = "max", shift = false, G, n, A, x, k = 0, rows = [], errs = [], rnd = GK.rng(11);
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" }), ctr3 = h("div", { class: "controls" });
      root.append(ctr, ctr2, ctr3);
      toggleGroup(ctr, [["paw", "csillag + él"], ["arviz", "Árvízhét"], ["star", "csillag (páros)"], ["path4", "4 csúcsú út"], ["twoTri", "két háromszög + híd"]], key, v => { key = v; load(); });
      toggleGroup(ctr2, [["max", "max = 1"], ["sum", "összeg = 1"], ["len", "hossz = 1"]], norm, v => { norm = v; reset(); });
      const shCb = h("input", { type: "checkbox", onchange: () => { shift = shCb.checked; reset(); } });
      ctr2.append(h("label", null, shCb, " $A + I$ használata"));
      ctr3.append(btn("Lépés ▶", () => step(1)), btn("+5 lépés", () => step(5)), btn("Újra: x₀ = 1", () => reset()), btn("Véletlen pozitív x₀", () => reset(true)));
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect: 0.45, radius: 17 });
      const tbl = h("div", { class: "tw", style: "overflow-x:auto" }), chart = h("div"), read = h("div", { class: "readout" });
      root.append(tbl, chart, read);
      const nf = v => (norm === "max" ? Math.max(...v.map(Math.abs)) : norm === "sum" ? v.reduce((a, b) => a + b, 0) : Math.hypot(...v));
      let E, v1;
      function load() {
        G = graphFor(key, 0.45); n = G.nodes.length; G.edges = G.edges.map(e => ({ ...e, w: 1 }));
        G.nodes.forEach(nd => { if (nd.sub) nd.y = 0.06 + nd.y * 0.86; });
        reset();
      }
      function reset(random) {
        A = adjM(n, G.edges);
        if (shift) A = A.map((r, i) => r.map((a, j) => a + (i === j ? 1 : 0)));
        E = eigSym(A);
        v1 = E.vecs[n - 1].map(Math.abs); const s = nf(v1); v1 = v1.map(a => a / s);
        x = random ? Array.from({ length: n }, () => 0.1 + rnd()) : new Array(n).fill(1);
        const s0 = nf(x); x = x.map(a => a / s0);
        k = 0; rows = [{ k: 0, c: null, x: x.slice() }]; errs = [err()];
        paint();
      }
      const err = () => Math.max(...x.map((a, i) => Math.abs(a - v1[i])));
      function step(m) {
        for (let s = 0; s < m; s++) { const y = matVec(A, x), c = nf(y); x = y.map(a => a / c); k++; rows.push({ k, c, x: x.slice() }); errs.push(err()); }
        paint();
      }
      function paint() {
        const mx = Math.max(...x);
        view.setGraph(G.nodes.map((nd, i) => {
          const u = mx ? x[i] / mx : 0;
          return { ...nd, color: mixColor("--card", "--setB", 0.12 + 0.78 * u), ink: inkFor(u), badge: fmt(x[i], 2) };
        }), G.edges);
        view.draw();
        const L = G.nodes.map(nd => nd.label), d = 2;
        const show = rows.slice(-7);
        tbl.innerHTML = `<table><tr><th>$k$</th><th>normáló szám</th>${L.map(l => `<th>${l}</th>`).join("")}</tr>` +
          show.map(r => `<tr><td>${r.k}</td><td>${r.c == null ? "–" : fmt(r.c, 3)}</td>${r.x.map(v => `<td>${fmt(v, d)}</td>`).join("")}</tr>`).join("") +
          `<tr style="border-top:2px solid var(--border)"><td>∞</td><td>${norm === "max" ? fmt(E.vals[n - 1], 3) : "–"}</td>${v1.map(v => `<td><b>${fmt(v, d)}</b></td>`).join("")}</tr></table>`;
        chart.innerHTML = errs.length > 2 ? spark(errs, { log: true, label: "eltérés a sajátvektortól (legnagyobb elemenkénti), logaritmikus skálán" }) : "";
        const lam = E.vals[n - 1], second = Math.max(...E.vals.slice(0, n - 1).map(Math.abs));
        const vals = E.vals.slice().reverse().map(v => fmt(v, 2)).join("; ");
        let t = `Spektrum${shift ? " ($A + I$)" : ""}: ${vals}. Domináns sajátérték ${shift ? "$\\lambda_1 + 1$" : "$\\lambda_1$"} $\\approx ${fmt(lam, 3)}$; `;
        t += Math.abs(second - lam) < 1e-9 ? `<b>van vele azonos abszolút értékű</b> ($-${fmt(lam, 2)}$) – a gráf páros, az iteráció nem tud dönteni: oszcillál.`
          : `a második legnagyobb abszolút értékű ${fmt(second, 3)}, az arány $|\\lambda_2|/|\\lambda_1| \\approx ${fmt(second / lam, 2)}$ – ${second / lam > 0.6 ? "lassú" : "gyors"} konvergencia.`;
        if (norm === "max" && k > 0) t += `<br>A normáló szám (max) $\\to \\lambda_1$: most ${fmt(rows[rows.length - 1].c, 3)}.`;
        const zero = E.vals.filter(v => Math.abs(v - lam) < 1e-9).length > 1;
        if (zero) t += "<br>A legnagyobb sajátérték többszörös – a gráf nem összefüggő?";
        if (shift) t += "<br>$A + I$: a sajátvektorok ugyanazok, minden sajátérték 1-gyel nagyobb, így a negatív „tükörsajátérték” már nem versenyez.";
        read.innerHTML = t; math(tbl); math(read);
      }
      load();
    };
  }

