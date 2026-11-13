  /* ==================================================================
     w1: 7.4 és 7.6 widgetjei (stub-matching, null-model-lab)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w2 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmS = (x, d = 2) => fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d).replace("-", MINUS);
    const fmK = (x, d = 2) => fmS(x, d).replace(",", "{,}").replace(MINUS, "-");      // KaTeX-be
    const grp = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ");                     // ezres tagolás
    const grpK = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\\,");                 // ezres tagolás KaTeX-ben
    const sv = c => `var(${c})`;
    const svgEl = (W_, H_, inner, label) =>
      `<svg viewBox="0 0 ${W_} ${H_}" style="width:100%;max-width:${W_}px;display:block" role="img" aria-label="${label}">${inner}</svg>`;
    const dfact = k => { let r = 1; for (let i = k; i > 1; i -= 2) r *= i; return r; };   // k!!
    const liftY = y => 0.07 + (y - 0.08) * 0.9;
    const actorIds = D.actors.map(a => a.id);

    /* hisztogram SVG-ben: pmf = [[érték, arány], …]; obs: megfigyelt érték (függőleges vonal) */
    function histSVG(pmf, obs, { narrow = false, xlabel = "", exact = false } = {}) {
      const vals = pmf.map(p => p[0]).concat(obs), lo = Math.min(...vals), hi = Math.max(...vals);
      const cnt = new Array(hi - lo + 1).fill(0); pmf.forEach(([v, f]) => (cnt[v - lo] += f));
      const Wd = narrow ? 340 : 560, Ht = 200, Lm = 40, Rm = 12, T = 24, B = 34, cmax = Math.max(...cnt) || 1;
      const bw = (Wd - Lm - Rm) / (hi - lo + 1), X = v => Lm + (v - lo + 0.5) * bw, Y = c => Ht - B - c / cmax * (Ht - T - B);
      let g = "";
      cnt.forEach((c, i) => {
        if (!c) return;
        const v = lo + i, hit = v === obs;
        g += `<rect x="${X(v) - bw * 0.42}" y="${Y(c)}" width="${bw * 0.84}" height="${Ht - B - Y(c)}" fill="${sv(hit ? "--setB" : "--setA")}" fill-opacity="0.8"><title>${v}: ${fmt(100 * c, 1)}%</title></rect>`;
      });
      const xs = Math.max(1, Math.ceil((hi - lo + 1) / (narrow ? 9 : 14)));
      for (let v = lo; v <= hi; v += xs) g += `<text x="${X(v)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10" fill="${sv("--muted")}">${v}</text>`;
      g += `<line x1="${Lm}" y1="${Ht - B}" x2="${Wd - Rm}" y2="${Ht - B}" stroke="${sv("--border")}"/>`;
      [0, 0.5, 1].forEach(t => g += `<text x="${Lm - 5}" y="${Y(t * cmax) + 3.5}" text-anchor="end" font-size="10" fill="${sv("--muted")}">${fmt(100 * t * cmax, 0)}%</text>`);
      g += `<line x1="${X(obs)}" y1="${T - 10}" x2="${X(obs)}" y2="${Ht - B}" stroke="${sv("--bad")}" stroke-width="2.5"/>` +
        `<text x="${Math.min(X(obs) + 5, Wd - Rm - 80)}" y="${T - 2}" font-size="11" font-weight="600" fill="${sv("--bad")}">megfigyelt: ${obs}</text>` +
        `<text x="${(Lm + Wd - Rm) / 2}" y="${Ht - 4}" text-anchor="middle" font-size="11" fill="${sv("--muted")}">${xlabel}${exact ? " (pontos eloszlás)" : ""}</text>`;
      return svgEl(Wd, Ht, g, "hisztogram: " + xlabel);
    }

    /* ------------------------------------------------------------------
       7.4  stub-matching – félélek párosítása és élcsere
       ------------------------------------------------------------------ */
    W["stub-matching"] = root => {
      header(root, "Konfigurációs modell: félélek és élcsere",
        "(a) Minden csúcs annyi <b>félélet</b> kap, amennyi a fokszáma; ezeket véletlenül párosítjuk. Figyeld a hurkokat és a többszörös éleket! Két csúcsra kattintva a várható élszámukat is látod. " +
        "(b) Az <b>élcsere</b> két él végeit cseréli meg: a fokszámok maradnak, a szerkezet változik.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.78 : 0.48;
      const tabs = h("div", { class: "controls" }); root.append(tabs);
      const pa = h("div"), pb = h("div"); root.append(pa, pb); pb.style.display = "none";
      toggleGroup(tabs, [["a", "(a) Félélek párosítása"], ["b", "(b) Élcsere"]], "a", v => {
        pa.style.display = v === "a" ? "" : "none"; pb.style.display = v === "b" ? "" : "none"; (v === "a" ? va : vb).resize();
      });

      /* ---------- (a) ---------- */
      const SEQ = {
        s211: { name: "(2, 1, 1)", labels: ["a", "b", "c"], deg: [2, 1, 1], pos: [[1, 0], [0, 1], [2, 1]] },
        s1111: { name: "(1, 1, 1, 1)", labels: ["A", "B", "C", "D"], deg: [1, 1, 1, 1], pos: [[0, 0], [1.4, 0], [1.4, 1], [0, 1]] },
        s22: { name: "(2, 2)", labels: ["a", "b"], deg: [2, 2], pos: [[0, 0], [1.6, 0]] },
        s3111: { name: "(3, 1, 1, 1)", labels: ["K", "1", "2", "3"], deg: [3, 1, 1, 1], pos: [[1, 0.7], [0, 0], [2, 0], [1, 1.6]] },
        arviz: { name: "Árvízhét" }
      };
      const ca = h("div", { class: "controls" }); pa.append(ca);
      let key = "s211", deg = [], match = null, pick = [], R = rng(7), simTok = 0;
      toggleGroup(ca, Object.entries(SEQ).map(([k, s]) => [k, s.name]), key, v => { key = v; load(); });
      const boxA = h("div"); pa.append(boxA);
      const va = new GK.View(boxA, { aspect, radius: narrow ? 14 : 16, nodes: [], edges: [], multiGap: 14,
        onNodeClick: i => { pick = pick.length >= 2 || pick.includes(i) ? [i] : pick.concat(i); va.hl = new Set(pick); va.draw(); simPair(); },
        onDraw: (ctx, v) => {                                        // a párosítatlan félélek: rövid „csonkok”
          if (match) return;
          const r = v.o.radius;
          ctx.strokeStyle = GK.css("--accent"); ctx.lineWidth = 2.5; ctx.lineCap = "round";
          v.nodes.forEach((nd, i) => {
            const [x, y] = v.px(nd), k = deg[i];
            for (let t = 0; t < k; t++) {
              const a = -Math.PI / 2 + (t - (k - 1) / 2) * 0.7;
              ctx.beginPath(); ctx.moveTo(x + Math.cos(a) * (r + 2), y + Math.sin(a) * (r + 2)); ctx.lineTo(x + Math.cos(a) * (r + 13), y + Math.sin(a) * (r + 13)); ctx.stroke();
            }
          });
          ctx.lineCap = "butt";
        } });
      const ca2 = h("div", { class: "controls" }); pa.append(ca2);
      ca2.append(btn("Párosítás", () => { match = stubMatch(deg, R); draw(); }, "btn primary"),
        btn("Szétszed", () => { match = null; draw(); }),
        btn("2000 párosítás", () => runMany()));
      const infoA = h("div", { class: "readout" }), infoS = h("div", { class: "readout" }); pa.append(infoA, infoS);

      function load() {
        match = null; pick = []; simTok++;
        let labels, pos;
        if (key === "arviz") {
          const order = ["Ko", "Vi", "Po", "La", "Ön", "Sz", "Kl"];
          const dg = degreeC(7, preset("arviz").edges);                        // a D.actors sorrendjében
          labels = order; deg = order.map(id => dg[actorIds.indexOf(id)]); pos = order.map(id => ACTOR_POS[id]);
          pick = [0, 2];                                                       // Ko–Po
        } else { const s = SEQ[key]; labels = s.labels; deg = s.deg.slice(); pos = s.pos; }
        const P = GK.normalize(pos, aspect);
        va.setGraph(labels.map((l, i) => ({ label: l, x: P[i][0], y: key === "arviz" ? liftY(P[i][1]) * 0.85 + 0.1 : 0.12 + P[i][1] * 0.8 })), []);
        va.hl = new Set(pick);
        draw(); infoS.innerHTML = "A „2000 párosítás” gomb megmutatja, milyen gyakori az egyszerű gráf, és mennyi a kiválasztott pár átlagos élszáma.";
        if (pick.length === 2) simPair();
      }
      function draw() {
        va.nodes.forEach((nd, i) => (nd.badge = deg[i]));
        if (match) {
          va.edges = match.edges.map(e => ({ a: e.a, b: e.b, w: 1, color: e.a === e.b ? "--bad" : null }));
          const cnt = {}; match.edges.forEach(e => { const k = GK.edgeKey(e.a, e.b); cnt[k] = (cnt[k] || 0) + 1; });
          va.edges.forEach(e => { if (e.a !== e.b && cnt[GK.edgeKey(e.a, e.b)] > 1) e.color = "--setB"; });
        } else va.edges = [];
        va.draw();
        const m2 = deg.reduce((s, k) => s + k, 0);
        let s = `Fokszámok: (${deg.join(", ")}) · félélek: $2m = ${m2}$ · lehetséges párosítások: $(2m - 1)!! = ${grpK(dfact(m2 - 1))}$`;
        if (match) {
          const simple = !match.loops && !match.multi;
          s += `<br>Ez a párosítás: hurok <b>${match.loops}</b>, többszörös élpár <b>${match.multi}</b> → ` +
            (simple ? "<b>egyszerű gráf</b> ✔" : "<b>nem egyszerű</b> (hurok: piros, többszörös él: narancs)");
        } else s += "<br><span class=\"muted\">A rövid vonások a még párosítatlan félélek.</span>";
        infoA.innerHTML = s; math(infoA);
      }
      function simPair() {
        if (pick.length !== 2) return;
        const [i, j] = pick, m2 = deg.reduce((s, k) => s + k, 0), lab = l => texLab(va.nodes[l].label);
        infoS.innerHTML = `Kiválasztott pár: $${lab(i)}$–$${lab(j)}$ · várható élszám: $\\dfrac{k_i k_j}{2m - 1} = \\dfrac{${deg[i]} \\cdot ${deg[j]}}{${m2 - 1}} = ${fmK(deg[i] * deg[j] / (m2 - 1), 3)}$` +
          ` <span class="muted">(közelítés: $k_i k_j/2m = ${fmK(deg[i] * deg[j] / m2, 3)}$)</span>`;
        math(infoS);
      }
      function runMany() {
        const tok = ++simTok, N = 2000; let done = 0, simple = 0, loops = 0, pair = 0;
        const RR = rng(11 + done);
        const step = () => {
          if (tok !== simTok) return;
          const t0 = performance.now();
          while (done < N && performance.now() - t0 < 20) {
            const M = stubMatch(deg, RR); done++;
            if (!M.loops && !M.multi) simple++;
            loops += M.loops;
            if (pick.length === 2) pair += M.edges.filter(e => GK.edgeKey(e.a, e.b) === GK.edgeKey(pick[0], pick[1])).length;
          }
          const m2 = deg.reduce((s, k) => s + k, 0);
          let s = `${grp(done)} párosítás: egyszerű gráf <b>${fmt(100 * simple / done, 1)}%</b> · átlagos hurokszám <b>${fmt(loops / done, 2)}</b>` +
            ` <span class="muted">(elmélet: $\\sum_i \\binom{k_i}{2}/(2m - 1) = ${fmK(deg.reduce((t, k) => t + k * (k - 1) / 2, 0) / (m2 - 1), 2)}$)</span>`;
          if (pick.length === 2) s += `<br>A kiválasztott pár átlagos élszáma: <b>${fmt(pair / done, 3)}</b> <span class="muted">(képlet: ${fmt(deg[pick[0]] * deg[pick[1]] / (m2 - 1), 3)})</span>`;
          infoS.innerHTML = s; math(infoS);
          if (done < N) setTimeout(step, 0);
        };
        step();
      }

      /* ---------- (b) ---------- */
      const cb = h("div", { class: "controls" }); pb.append(cb);
      let keyB = "twoTri", RB = rng(3), last = null;
      toggleGroup(cb, [["twoTri", "két háromszög"], ["arviz", "Árvízhét"], ["star", "csillag"]], keyB, v => { keyB = v; loadB(); });
      const boxB = h("div"); pb.append(boxB);
      const vb = new GK.View(boxB, { aspect, radius: narrow ? 14 : 16, nodes: [], edges: [] });
      const cb2 = h("div", { class: "controls" }); pb.append(cb2);
      cb2.append(btn("Egy csere", () => swapOnce(true), "btn primary"), btn("100 csere", () => { for (let t = 0; t < 100; t++) swapOnce(false); last = null; drawB("100 cserekísérlet után."); }),
        btn("Vissza az eredetihez", () => loadB()));
      const infoB = h("div", { class: "readout" }); pb.append(infoB);
      let deg0 = [];
      function loadB() {
        let G;
        if (keyB === "twoTri") {
          const P = GK.normalize([[0, 0], [0, 1.2], [1, 0.6], [2, 0.6], [3, 0], [3, 1.2]], aspect);
          G = { nodes: ["1", "2", "3", "4", "5", "6"].map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })),
            edges: [[0, 1], [1, 2], [2, 0], [3, 4], [4, 5], [5, 3]].map(([a, b]) => ({ a, b, w: 1 })) };
        } else if (keyB === "arviz") {
          const A = preset("arviz", aspect); G = { nodes: A.nodes.map(nd => ({ label: nd.label, x: nd.x, y: liftY(nd.y) })), edges: A.edges.map(e => ({ a: e.a, b: e.b, w: 1 })) };
        } else { const S = preset("star", aspect); G = { nodes: S.nodes, edges: S.edges }; }
        vb.setGraph(G.nodes, G.edges);
        deg0 = degreeC(G.nodes.length, G.edges); last = null;
        drawB("Kiinduló gráf.");
      }
      function swapOnce(show) {
        const E = vb.edges, m = E.length; if (m < 2) return;
        const i = Math.floor(RB() * m); let j = Math.floor(RB() * (m - 1)); if (j >= i) j++;
        let [a, b] = [E[i].a, E[i].b], [c, d] = [E[j].a, E[j].b];
        if (RB() < 0.5) [c, d] = [d, c];
        const has = (x, y) => E.some(e => GK.edgeKey(e.a, e.b) === GK.edgeKey(x, y));
        let why = "";
        if (a === d || c === b) why = "hurok lenne";
        else if (has(a, d) || has(c, b)) why = "többszörös él lenne";
        const L = l => vb.nodes[l].label;
        if (!why) { E[i] = { a, b: d, w: 1 }; E[j] = { a: c, b, w: 1 }; }
        if (show) {
          last = { old: [[a, b], [c, d]], neu: [[a, d], [c, b]], ok: !why };
          drawB(why ? `Kísérlet: ${L(a)}–${L(b)} és ${L(c)}–${L(d)} → ${L(a)}–${L(d)} és ${L(c)}–${L(b)}: <b>elvetve</b> (${why}).`
                    : `Csere: ${L(a)}–${L(b)} és ${L(c)}–${L(d)} → <b>${L(a)}–${L(d)}</b> és <b>${L(c)}–${L(b)}</b>.`);
        }
      }
      function drawB(msg) {
        vb.hlE = new Set();
        vb.edges.forEach(e => (e.dash = null));
        if (last && last.ok) last.neu.forEach(([x, y]) => vb.hlE.add(GK.edgeKey(x, y)));
        const n = vb.nodes.length, dg = degreeC(n, vb.edges), T = triangles(n, vb.edges), comp = components(n, vb.edges);
        vb.nodes.forEach((nd, i) => (nd.badge = dg[i]));
        vb.draw();
        if (last && !last.ok) {                                         // az elvetett új élek szaggatottan
          const ctx = vb.ctx; ctx.save(); ctx.setLineDash([5, 4]); ctx.strokeStyle = GK.css("--bad"); ctx.lineWidth = 2;
          last.neu.forEach(([x, y]) => { const [x1, y1] = vb.px(vb.nodes[x]), [x2, y2] = vb.px(vb.nodes[y]); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); });
          ctx.restore();
        }
        const same = dg.every((k, i) => k === deg0[i]);
        infoB.innerHTML = `${msg}<br>Fokszámok: (${dg.join(", ")}) ${same ? "– <b>változatlanok</b> ✔" : ""} · háromszögek: <b>${T.list.length}</b> · komponensek: <b>${comp.sizes.length}</b>` +
          (keyB === "star" ? "<br><span class=\"muted\">A csillagon minden csere hurkot adna – ez az egyetlen egyszerű gráf ezzel a fokszámsorozattal.</span>" : "");
      }
      load(); loadB();
    };

    /* ------------------------------------------------------------------
       7.6  null-model-lab – az Árvízhét három nullmodellel
       ------------------------------------------------------------------ */
    W["null-model-lab"] = root => {
      header(root, "Nullmodell-labor: sok ez – mihez képest?",
        "Válassz egy mérőszámot és egy nullmodellt, és sorsolj 1000 véletlen változatot. A hisztogram a nullmodell eloszlása, a piros vonal a megfigyelt érték. " +
        "Szereplőpárt az élre (vagy két csúcsra) kattintva választhatsz.");
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.8 : 0.48;
      const A = preset("arviz", aspect);
      const OBS = project(ARTICLE_ROWS, 7);
      const cS = h("div", { class: "controls" }), cN = h("div", { class: "controls" });
      root.append(cS);
      let stat = "pair", nul = "bip", pair = [3, 4], samples = null, tok = 0, seed = 1;
      const STATS = [["pair", "egy pár közös cikkei"], ["tri", "háromszögek száma"], ["edges", "különböző párok (élek) száma"]];
      const NULLS = { gnm: "G(n, m)", conf: "fokszámtartó élcsere", hyp: "hipergeometrikus (csak a két szereplő gyakorisága)", bip: "páros: cikk–szereplő csere" };
      const paintS = toggleGroup(cS, STATS, stat, v => { stat = v; fixNull(); reset(); });
      const grid = h("div", { class: narrow ? "" : "two-col" }), left = h("div"), right = h("div");
      grid.append(left, right); root.append(grid);
      left.append(h("div", { class: "muted", style: "font-size:.88rem;margin:.1rem 0" }, "megfigyelt gráf (szám: közös cikkek)"));
      right.append(h("div", { class: "muted", style: "font-size:.88rem;margin:.1rem 0" }, "a legutóbbi véletlen változat"));
      const bL = h("div"), bR = h("div"); left.append(bL); right.append(bR);
      const vo = { aspect, radius: narrow ? 13 : 14, showWeights: true, maxW: narrow ? 760 : 380 };
      const vL = new GK.View(bL, Object.assign({}, vo, { nodes: A.nodes.map(nd => ({ label: nd.label, x: nd.x, y: liftY(nd.y) })), edges: A.edges.map(e => ({ ...e })),
        onEdgeClick: i => { const e = vL.edges[i]; pair = [e.a, e.b]; if (stat !== "pair") { stat = "pair"; paintS(stat); fixNull(); } reset(); },
        onNodeClick: i => { if (pair.length === 2 || pair.includes(i)) pair = [i]; else pair = pair.concat(i); if (pair.length === 2) { if (stat !== "pair") { stat = "pair"; paintS(stat); fixNull(); } reset(); } else { mark(); } } }));
      const vR = new GK.View(bR, Object.assign({}, vo, { nodes: A.nodes.map(nd => ({ label: nd.label, x: nd.x, y: liftY(nd.y) })), edges: [] }));
      root.append(cN);
      const nullBtns = {};
      Object.entries(NULLS).forEach(([k, l]) => { nullBtns[k] = btn(l, () => { nul = k; paintN(); reset(); }); cN.append(nullBtns[k]); });
      const paintN = () => Object.entries(nullBtns).forEach(([k, b]) => { b.classList.toggle("on", k === nul); b.disabled = !allowed(k); });
      const allowed = k => (stat === "pair" ? k === "hyp" || k === "bip" : k !== "hyp");
      function fixNull() { if (!allowed(nul)) nul = stat === "pair" ? "bip" : "conf"; paintN(); }
      const cR = h("div", { class: "controls" }); root.append(cR);
      const runB = btn("1000 véletlen változat", () => run(), "btn primary"), prog = h("span", { class: "muted", style: "font-size:.9rem;font-family:var(--mono)" });
      cR.append(runB, prog);
      const hist = h("div"), info = h("div", { class: "readout" });
      root.append(hist, info);
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" }); root.append(lesson);

      const labOf = i => texLab(actorIds[i]);
      function observed() {
        if (stat === "pair") return OBS.W[pair[0]][pair[1]];
        if (stat === "tri") return triangles(7, OBS.edges).list.length;
        return OBS.edges.length;
      }
      function statOf(edges, Wm) {
        if (stat === "pair") return Wm ? Wm[pair[0]][pair[1]] : 0;
        if (stat === "tri") return triangles(7, edges).list.length;
        return edges.length;
      }
      function mark() {
        vL.hlE = new Set(stat === "pair" && pair.length === 2 ? [GK.edgeKey(pair[0], pair[1])] : []);
        vL.hl = new Set(stat === "pair" ? pair : []);
        vL.draw();
      }
      function reset() { tok++; samples = null; prog.textContent = ""; runB.disabled = false; mark(); paint(); }
      function freq(i) { return ARTICLE_ROWS.filter(r => r.includes(i)).length; }
      function exactHyp() {
        const N = ARTICLE_ROWS.length, a = freq(pair[0]), b = freq(pair[1]), out = [];
        for (let j = 0; j <= Math.min(a, b); j++) out.push([j, hyperPmf(N, a, b, j)]);
        return out;
      }
      function run() {
        if (stat === "pair" && pair.length !== 2) { info.innerHTML = "Előbb válassz egy szereplőpárt (élre vagy két csúcsra kattintva)."; return; }
        if (nul === "hyp") { samples = { exact: exactHyp() }; vR.setGraph(vR.nodes, []); paint(); return; }
        const t = ++tok, R = rng(100 * seed++ + Object.keys(NULLS).indexOf(nul)), N = 1000, out = [];
        const E0 = OBS.edges.map(e => ({ a: e.a, b: e.b, w: 1 }));
        let lastG = null;
        runB.disabled = true;
        const step = () => {
          if (t !== tok) return;
          const t0 = performance.now();
          while (out.length < N && performance.now() - t0 < 25) {
            let edges, Wm = null;
            if (nul === "gnm") edges = gnm(7, E0.length, R);
            else if (nul === "conf") edges = rewire(7, E0, 100, R);
            else { const P = project(curveball(ARTICLE_ROWS, 60, R), 7); edges = P.edges; Wm = P.W; }
            out.push(statOf(edges, Wm)); lastG = edges;
          }
          prog.textContent = `${out.length} / ${N}`;
          if (out.length < N) setTimeout(step, 0);
          else {
            const c = {}; out.forEach(x => (c[x] = (c[x] || 0) + 1));
            samples = { raw: out, pmf: Object.entries(c).map(([v, k]) => [+v, k / N]).sort((x, y) => x[0] - y[0]) };
            vR.setGraph(vR.nodes, lastG.map(e => ({ a: e.a, b: e.b, w: e.w || 1 })));
            runB.disabled = false; prog.textContent = "kész";
            paint();
          }
        };
        prog.textContent = `0 / ${N}`;
        setTimeout(step, 0);
      }
      function paint() {
        const obs = observed();
        const what = stat === "pair" ? `a $${labOf(pair[0])}$–$${labOf(pair[1] ?? pair[0])}$ pár közös cikkei` : stat === "tri" ? "a háromszögek száma" : "a különböző szereplőpárok (élek) száma";
        const keeps = { gnm: "7 csúcs és 10 él", conf: "minden szereplő fokszáma a vetületben", hyp: "a két szereplő cikkszáma (12 cikkből)", bip: "minden cikk szereplőszáma és minden szereplő cikkszáma" }[nul];
        lesson.textContent = "";
        if (!samples) {
          hist.innerHTML = "";
          info.innerHTML = `Mérőszám: ${what} · megfigyelt: <b>${obs}</b><br>Nullmodell: <b>${NULLS[nul]}</b> – megtartja: ${keeps}. Nyomd meg a gombot!`;
          math(info); return;
        }
        const pmf = samples.exact || samples.pmf;
        const mu = pmf.reduce((s, [v, f]) => s + v * f, 0), sd = Math.sqrt(pmf.reduce((s, [v, f]) => s + (v - mu) ** 2 * f, 0));
        const ge = pmf.filter(([v]) => v >= obs).reduce((s, [, f]) => s + f, 0), le = pmf.filter(([v]) => v <= obs).reduce((s, [, f]) => s + f, 0);
        const N = samples.raw ? samples.raw.length : 0;
        const pGe = samples.exact ? ge : (1 + Math.round(ge * N)) / (1 + N), pLe = samples.exact ? le : (1 + Math.round(le * N)) / (1 + N);
        const z = sd > 1e-12 ? (obs - mu) / sd : NaN;
        hist.innerHTML = histSVG(pmf, obs, { narrow, exact: !!samples.exact, xlabel: stat === "pair" ? "közös cikkek száma" : stat === "tri" ? "háromszögek száma" : "különböző párok száma" });
        info.innerHTML = `Mérőszám: ${what} · megfigyelt: <b>${obs}</b> · nullmodell: <b>${NULLS[nul]}</b> (megtartja: ${keeps})` +
          `<br>átlag $\\bar x_0 = ${fmK(mu, 2)}$ · szórás $s_0 = ${fmK(sd, 2)}$ · $z = ${isFinite(z) ? fmK(z, 2) : "\\text{--}"}$` +
          `<br>${samples.exact ? "pontos" : "empirikus"} $p$: legalább ${obs}: $${fmK(pGe, 3)}$ · legfeljebb ${obs}: $${fmK(pLe, 3)}$` +
          (samples.exact ? "" : ` <span class="muted">($(1 + \\#)/(1 + N)$, $N = ${N}$)</span>`);
        math(info);
        if (stat === "tri" && nul === "bip") lesson.textContent = "A cikkek szerkezetéből több háromszög jönne: a valódi szereplők a saját köreikben maradnak.";
        else if (stat === "tri") lesson.textContent = "A vetületen futó nullmodell nem tudja, hogy a háromszereplős cikkek „gyári” háromszögeket adnak.";
        else if (stat === "pair" && nul === "bip" && pGe < 0.05) lesson.textContent = "Ehhez a nullmodellhez képest meglepő – de 21 pár közül egy-kettő véletlenül is ilyen lehet (többszörös tesztelés).";
        else if (stat === "pair" && nul === "hyp") lesson.textContent = "A hipergeometrikus modell nem tudja, hogy a cikkek kicsik – a páros nullmodellben ugyanez meglepőbb.";
      }
      fixNull(); mark(); paint();
    };
  }
