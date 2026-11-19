  /* ==================================================================
     w2: 8.4, 8.6, 8.7 widgetjei (louvain-steps, sbm-generator, stability-check)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const MINUS = "−";
    const fmtS = (x, d = 3) => fmt(Math.abs(x) < 0.5 * Math.pow(10, -d) ? 0 : x, d).replace("-", MINUS);
    const fmtP = (x, d = 3) => (x > 0.5 * Math.pow(10, -d) ? "+" : "") + fmtS(x, d);
    const pct = x => Math.round(100 * x) + "%";
    const sv = c => (String(c).startsWith("--") ? `var(${c})` : c);
    const sw = c => `<span style="display:inline-block;width:.8em;height:.8em;border-radius:50%;background:${sv(c)};vertical-align:-.05em;margin-right:.2em"></span>`;
    const median = xs => { const s = xs.slice().sort((a, b) => a - b), k = s.length >> 1; return s.length % 2 ? s[k] : (s[k - 1] + s[k]) / 2; };
    /* saját vászon (sok kis cellához) */
    function canvasBox(parent, aspect, maxW = 760) {
      const c = h("canvas", { style: "display:block;touch-action:manipulation;max-width:100%" });
      parent.append(c);
      const o = { c, ctx: c.getContext("2d"), w: 0, h: 0, aspect, maxW, onResize: null };
      o.resize = () => {
        const w = Math.min(o.maxW, parent.clientWidth || 320), hh = Math.round(w * o.aspect), dpr = window.devicePixelRatio || 1;
        c.width = Math.round(w * dpr); c.height = Math.round(hh * dpr); c.style.width = w + "px"; c.style.height = hh + "px";
        o.ctx.setTransform(dpr, 0, 0, dpr, 0, 0); o.w = w; o.h = hh;
        if (o.onResize) o.onResize();
      };
      let t; addEventListener("resize", () => { clearTimeout(t); t = setTimeout(o.resize, 150); });
      new MutationObserver(() => o.onResize && o.onResize()).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
      o.resize();
      return o;
    }
    /* darabolt futtatás: job(i) i = 0 … total−1, kötegenként „per” darab; onProg(kész), onDone() */
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
    /* együttes-besorolási mátrix → konszenzus: C > 0,5 komponensei */
    function consensusOf(n, C) {
      const E = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (C[i][j] > 0.5) E.push({ a: i, b: j });
      const comp = components(n, E).comp;
      /* sorszám a méret szerint csökkenően */
      const sz = new Map(); comp.forEach(c => sz.set(c, (sz.get(c) || 0) + 1));
      const ord = [...sz.keys()].sort((a, b) => sz.get(b) - sz.get(a) || comp.indexOf(a) - comp.indexOf(b));
      return comp.map(c => ord.indexOf(c));
    }
    /* a csúcs stabilitása: azokkal a társaival, akikkel valaha egy közösségbe került, vagy a konszenzusban egy közösségben van,
       a futások hányad részében „ért egyet” a konszenzussal (együtt, ha egy konszenzus-közösség; külön, ha nem) */
    function stabilityOf(n, C, cons) {
      return [...Array(n).keys()].map(i => {
        let s = 0, c = 0;
        for (let j = 0; j < n; j++) {
          if (j === i) continue;
          const same = cons[i] === cons[j];
          if (!same && C[i][j] === 0) continue;
          s += same ? C[i][j] : 1 - C[i][j]; c++;
        }
        return c ? s / c : 1;
      });
    }
    /* két címkézés illesztése: a b-címkék színe az a-címkék közül a legnagyobb átfedésű (mohón); a maradék új színt kap */
    function matchColors(a, b, K) {
      const A = relabel(a), B = relabel(b), T = contingency(A, B), pairs = [];
      T.forEach((r, i) => r.forEach((x, j) => x && pairs.push([x, i, j])));
      pairs.sort((p, q) => q[0] - p[0]);
      const map = new Map(), used = new Set();
      pairs.forEach(([, i, j]) => { if (!map.has(j) && !used.has(i)) { map.set(j, i); used.add(i); } });
      let nx = Math.max(K, nComm(A));
      for (let j = 0; j < T[0].length; j++) if (!map.has(j)) map.set(j, nx++);
      return B.map(x => map.get(x));
    }

    /* ------------------------------------------------------------------
       Louvain lépésről lépésre – a w0 louvain() pontos mása, állapotgépként
       (ugyanannyi és ugyanolyan sorrendű R()-hívás → ugyanaz a partíció)
       ------------------------------------------------------------------ */
    function lvStepper(n, edges, gamma, R) {
      const S = { level: 0, phase: "move", totalMoves: 0, levelMoves: 0 };
      let N = n, adj = Array.from({ length: n }, () => new Map()), self = new Array(n).fill(0), members = [...Array(n).keys()].map(i => [i]);
      let m2 = 0;
      edges.forEach(e => {
        const w = 1;
        if (e.a === e.b) { self[e.a] += 2 * w; m2 += 2 * w; return; }
        adj[e.a].set(e.b, (adj[e.a].get(e.b) || 0) + w); adj[e.b].set(e.a, (adj[e.b].get(e.a) || 0) + w); m2 += 2 * w;
      });
      S.m2 = m2;
      let orig = [...Array(n).keys()], ccol = [...Array(n).keys()], ccolNext = ccol;
      let k, com, tot, order, pos, moved, improved, rounds, rl;
      function startRound() {
        order = [...Array(N).keys()];
        for (let i = N - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
        pos = 0; moved = false; rounds++;
      }
      function initLevel() {
        k = new Array(N).fill(0);
        for (let i = 0; i < N; i++) { k[i] = self[i]; adj[i].forEach(w => (k[i] += w)); }
        com = [...Array(N).keys()]; tot = k.slice(); improved = false; rounds = 0; S.levelMoves = 0;
        startRound();
      }
      function endPhase() {
        rl = relabel(com);
        orig = orig.map(s => rl[s]);
        ccolNext = new Array(nComm(rl));
        for (let i = 0; i < N; i++) ccolNext[rl[i]] = ccol[com[i]];
        S.phase = improved ? "merge" : "done";
      }
      /* a c közösség eredeti csúcsai (a „skip” szuperpont nélkül) */
      S.membersOf = (c, skip = -1) => { const out = []; for (let s = 0; s < N; s++) if (s !== skip && com[s] === c) out.push(...members[s]); return out.sort((x, y) => x - y); };
      S.step = () => {
        if (S.phase !== "move") return null;
        const i = order[pos], ci = com[i], wTo = new Map();
        adj[i].forEach((w, j) => wTo.set(com[j], (wTo.get(com[j]) || 0) + w));
        tot[ci] -= k[i];
        const gain = c => (wTo.get(c) || 0) - gamma * tot[c] * k[i] / m2;
        const g0 = gain(ci);
        let best = ci, bg = g0;
        const rows = [{ c: ci, w: wTo.get(ci) || 0, tot: tot[ci], dQ: 2 * g0 / m2, stay: true, mem: S.membersOf(ci, i) }];
        wTo.forEach((_, c) => {
          const g = gain(c);
          if (c !== ci) rows.push({ c, w: wTo.get(c), tot: tot[c], dQ: 2 * g / m2, stay: false, mem: S.membersOf(c, i) });
          if (g > bg + 1e-12) { best = c; bg = g; }
        });
        tot[best] += k[i];
        const rec = { node: i, ci, best, rows, ki: k[i], gain: 2 * (bg - g0) / m2, moved: best !== ci, level: S.level, round: rounds, pos: pos + 1, N,
          self: members[i].slice(), col: c => ccol[c] };
        if (best !== ci) { com[i] = best; moved = improved = true; S.totalMoves++; S.levelMoves++; }
        pos++;
        if (pos === N) { if (moved && rounds < 100) startRound(); else endPhase(); }
        return rec;
      };
      S.merge = () => {
        if (S.phase !== "merge") return;
        const K = nComm(rl), adj2 = Array.from({ length: K }, () => new Map()), self2 = new Array(K).fill(0), mem2 = Array.from({ length: K }, () => []);
        for (let i = 0; i < N; i++) {
          mem2[rl[i]].push(...members[i]);
          self2[rl[i]] += self[i];
          adj[i].forEach((w, j) => {
            const a = rl[i], b = rl[j];
            if (a === b) self2[a] += w;
            else adj2[a].set(b, (adj2[a].get(b) || 0) + w);
          });
        }
        N = K; adj = adj2; self = self2; members = mem2; ccol = ccolNext;
        if (N === 1) { S.phase = "done"; return; }
        S.level++; S.phase = "move"; initLevel();
      };
      /* lekérdezések */
      S.N = () => N;
      S.members = () => members;
      S.adj = () => adj;
      S.self = () => self;
      S.rounds = () => rounds;
      S.pos = () => pos;
      S.superCom = s => (S.phase === "move" ? com[s] : rl[s]);
      S.colOfLabel = c => (S.phase === "move" ? ccol[c] : ccolNext[c]);
      S.labOrig = () => (S.phase === "move" ? orig.map(s => com[s]) : orig.slice());
      S.superOf = () => orig.slice();                    // eredeti csúcs → aktuális szuperpont (csak „move” fázisban értelmes)
      initLevel();
      return S;
    }

    function threeCliques(aspect) {
      const labels = [], pos = [], edges = [];
      ["A", "B", "C"].forEach((L, t) => {
        const x0 = 2 * t;
        [[0, 0.5], [0.6, 0], [0.6, 1], [1.2, 0.5]].forEach(([x, y], i) => { labels.push(L + (i + 1)); pos.push([x0 + x, y]); });
        for (let i = 0; i < 4; i++) for (let j = i + 1; j < 4; j++) edges.push({ a: 4 * t + i, b: 4 * t + j, w: 1 });
      });
      edges.push({ a: 3, b: 4, w: 1 }, { a: 7, b: 8, w: 1 });
      const P = GK.normalize(pos, aspect);
      return { name: "három klikk", nodes: labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges };
    }

    W["louvain-steps"] = root => {
      header(root, "Louvain lépésről lépésre",
        "1. fázis: a csúcsokat véletlen sorrendben sorra vesszük, és mindegyiket oda tesszük, ahol a legnagyobb a modularitásnövekmény: " +
        "$\\Delta Q = \\dfrac{k_{i,C}}{m} - \\gamma\\,\\dfrac{\\Sigma_{\\text{tot}}(C)\\,k_i}{2m^2}$ " +
        "($k_{i,C}$: az i élei a C-be, $\\Sigma_{\\text{tot}}(C)$: C fokszámösszege i nélkül). Ha a saját közössége (a „marad” sor) a legjobb, marad. " +
        "Ha egy teljes körben senki sem mozdult, jöhet a 2. fázis: a közösségekből szuperpontok lesznek, és minden kezdődik elölről.");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560;
      const DATA = {
        twoTri: { name: "két háromszög + híd", asp: narrow ? 0.62 : 0.4, r: 15, make: a => preset("twoTri", a) },
        three: { name: "három klikk", asp: narrow ? 0.45 : 0.3, r: 14, make: a => threeCliques(a) },
        arviz: { name: "Árvízhét", asp: narrow ? 0.85 : 0.5, r: 15,
          make: a => { const g = preset("arviz", a); g.edges = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); return g; } },
        karate: { name: "karateklub", asp: narrow ? 0.95 : 0.62, r: narrow ? 9 : 11,
          make: a => { const g = preset("karate", a); g.edges = g.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); return g; } }
      };
      let key = "twoTri", seed = 1, gamma = 1, G, S, rec = null, showOrig = false, chkDisc = false, busy = false;

      const c1 = h("div", { class: "controls" });
      toggleGroup(c1, Object.entries(DATA).map(([k, d]) => [k, d.name]), key, v => { key = v; seed = 1; seedOut.textContent = seed; build(); });
      const c2 = h("div", { class: "controls" });
      const bStep = btn("Következő lépés", () => act("step"), "btn primary"), bPhase = btn("Fázis végéig", () => act("phase")),
        bMerge = btn("Összevonás (2. fázis)", () => act("merge")), bAll = btn("Végig", () => act("all")), bReset = btn("Újra", () => reset());
      c2.append(bStep, bPhase, bMerge, bAll, bReset);
      const c3 = h("div", { class: "controls" });
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      const gOut = h("b", { style: "font-family:var(--mono);min-width:2.2em" }, "1,0");
      const gSl = h("input", { type: "range", min: 0.2, max: 3, step: 0.1, value: 1, "aria-label": "felbontási paraméter", style: "width:10rem;max-width:45vw",
        oninput: () => { gamma = +gSl.value; gOut.textContent = fmt(gamma, 1).includes(",") ? fmt(gamma, 1) : fmt(gamma, 1) + ",0"; reset(); } });
      const cbOrig = h("input", { type: "checkbox", onchange: () => { showOrig = cbOrig.checked; render(); } });
      const cbDisc = h("input", { type: "checkbox", onchange: () => { chkDisc = cbDisc.checked; renderInfo(); } });
      c3.append(h("label", null, "sorrend (mag):", seedOut), btn("Új sorrend", () => { seed++; seedOut.textContent = seed; reset(); }),
        h("label", null, "γ =", gSl, gOut),
        h("label", null, cbOrig, "eredeti csúcsokkal"), h("label", null, cbDisc, "Szétszakadt közösség?"));
      root.append(c1, c2, c3);
      const box = h("div");
      root.append(box);
      const legend = h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0 0" });
      const info = h("div", { class: "readout" });
      const tbl = h("div", { class: "tw", style: "overflow-x:auto" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "A Louvain mohó: minden csúcs oda megy, ahol most a legjobb – gyors, de a sorrendtől függ, és a végeredmény helyi optimum.");
      root.append(legend, info, tbl, lesson);

      let superMode = false, superSize = [], superSelf = [], hlSuper = -1;
      const view = new GK.View(box, {
        aspect: DATA[key].asp, radius: DATA[key].r, showWeights: false,
        onDraw: (ctx, v) => {
          if (!superMode) return;
          const text = GK.css("--text"), card = GK.css("--card"), accent = GK.css("--accent"), muted = GK.css("--muted");
          const r0 = Math.min(v.w, 700) / 46;
          v.nodes.forEach((nd, i) => {
            const [x, y] = v.px(nd), R_ = Math.max(v.o.radius + 1, Math.min(r0 * Math.sqrt(superSize[i]), v.h / 5)), col = GK.color(nd.fill);
            if (superSelf[i] > 0) {                           // hurok: a belső élek
              ctx.strokeStyle = muted; ctx.lineWidth = 2;
              ctx.beginPath(); ctx.arc(x, y - R_ - 7, 9, 0, 2 * Math.PI); ctx.stroke();
              const lab = fmt(superSelf[i], 1);
              ctx.font = "600 11px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
              ctx.fillStyle = card; ctx.beginPath(); ctx.arc(x, y - R_ - 16, 3.6 * lab.length + 4, 0, 2 * Math.PI); ctx.fill();
              ctx.fillStyle = text; ctx.fillText(lab, x, y - R_ - 16);
            }
            ctx.beginPath(); ctx.arc(x, y, R_, 0, 2 * Math.PI);
            ctx.fillStyle = col; ctx.fill();
            ctx.lineWidth = i === hlSuper ? 4 : 1.5; ctx.strokeStyle = i === hlSuper ? accent : text; ctx.stroke();
            if (i === hlSuper) { ctx.setLineDash([3, 3]); ctx.beginPath(); ctx.arc(x, y, R_ + 5, 0, 2 * Math.PI); ctx.stroke(); ctx.setLineDash([]); }
            ctx.fillStyle = "#fff"; ctx.font = "700 13px system-ui, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
            ctx.fillText(String(superSize[i]), x, y + 0.5);
          });
        }
      });

      const nameOf = mem => {
        if (!mem.length) return "– (egyedül)";
        const L = mem.map(i => G.nodes[i].label);
        return "{" + (L.length <= 4 ? L.join(", ") : L.slice(0, 3).join(", ") + ", … (" + L.length + ")") + "}";
      };
      function build() {
        const d = DATA[key];
        view.o.aspect = d.asp; view.o.radius = d.r;
        G = d.make(d.asp);
        G.P0 = G.nodes.map(nd => [nd.x, nd.y]);
        view.resize();
        reset();
      }
      function reset() {
        if (busy) return;
        S = lvStepper(G.nodes.length, G.edges, gamma, rng(seed));
        const ref = louvain(G.nodes.length, G.edges, { R: rng(seed), gamma });
        S.ref = ref;
        rec = null; superMode = null;
        render();
      }
      /* a megjelenített gráf: eredeti vagy szuperpontos */
      function render() {
        const wantSuper = S.level >= 1 && !showOrig;
        const n = G.nodes.length, lab = S.labOrig();
        if (wantSuper !== superMode) {
          superMode = wantSuper;
          if (wantSuper) setSuperGraph(); else view.setGraph(G.nodes.map((nd, i) => Object.assign({}, nd, { x: G.P0[i][0], y: G.P0[i][1] })), G.edges);
          view.o.showWeights = wantSuper;
        } else if (wantSuper) setSuperGraph(true);
        view.hl = new Set(); view.hlE = new Set(); view.dim = false; hlSuper = -1;
        if (superMode) {
          const N = S.N();
          for (let s = 0; s < N; s++) view.nodes[s].fill = commColor(S.colOfLabel(S.superCom(s)));
          view.nodes.forEach(nd => (nd.color = nd.fill));
          if (rec && rec.level === S.level) {
            hlSuper = rec.node;
            S.adj()[rec.node].forEach((_, j) => view.hlE.add(GK.edgeKey(rec.node, j)));
            view.hl = new Set([rec.node]);
          }
        } else {
          for (let i = 0; i < n; i++) view.nodes[i].color = commColor(S.colOfLabel(lab[i]));
          if (rec) {
            const mine = new Set(rec.self);
            view.hl = mine;
            G.edges.forEach(e => { if (mine.has(e.a) !== mine.has(e.b)) view.hlE.add(GK.edgeKey(e.a, e.b)); });
          }
        }
        view.draw();
        legend.innerHTML = superMode
          ? "Szuperpontok: a méret ∝ √(tagok száma), a körben a tagok száma, a hurkon a belső élek száma, az éleken a közösségek közti élek száma. A szín: a közösség."
          : "A szín: a csúcs aktuális közössége. Kiemelve: a most vizsgált csúcs" + (S.level >= 1 ? " (szuperpont tagjai)" : "") + " és a szomszédai felé futó élek.";
        renderInfo(); renderTable();
        const mv = S.phase === "move";
        bStep.disabled = !mv; bPhase.disabled = !mv; bMerge.disabled = S.phase !== "merge"; bAll.disabled = S.phase === "done";
        bMerge.classList.toggle("primary", S.phase === "merge"); bStep.classList.toggle("primary", mv);
      }
      function setSuperGraph(keepPos) {
        const N = S.N(), mem = S.members(), adj = S.adj(), self = S.self();
        superSize = mem.map(m => m.length); superSelf = self.map(x => x / 2);
        const nodes = mem.map((m, s) => {
          const cx = m.reduce((t, i) => t + G.P0[i][0], 0) / m.length, cy = m.reduce((t, i) => t + G.P0[i][1], 0) / m.length;
          const old = keepPos && view.nodes[s];
          return { label: "", x: old ? old.x : cx, y: old ? old.y : cy };
        });
        if (!keepPos) separate(nodes, superSize);
        const edges = [];
        for (let a = 0; a < N; a++) adj[a].forEach((w, b) => { if (a < b) edges.push({ a, b, w, label: fmt(w, 1) }); });
        if (keepPos) { view.nodes = view.nodes.slice(0, N); view.edges = edges.map(e => Object.assign({ w: 1 }, e)); }
        else view.setGraph(nodes, edges);
      }
      /* a szuperpontok ne fedjék egymást: egyszerű taszítás a sugarak szerint (képpontban számolva) */
      function separate(nodes, size) {
        const Wd = view.w, Ht = view.h, r0 = Math.min(Wd, 700) / 46, gap = 26;
        const R_ = size.map(z => Math.max(view.o.radius + 1, Math.min(r0 * Math.sqrt(z), Ht / 5)));
        const P = nodes.map(nd => [nd.x * Wd, nd.y * Ht]);
        for (let it = 0; it < 200; it++) {
          let moved = false;
          for (let i = 0; i < P.length; i++) for (let j = i + 1; j < P.length; j++) {
            let dx = P[j][0] - P[i][0], dy = P[j][1] - P[i][1], d = Math.hypot(dx, dy);
            const need = R_[i] + R_[j] + gap;
            if (d >= need) continue;
            if (d < 1e-6) { dx = 1; dy = 0.3; d = Math.hypot(dx, dy); }
            const push = (need - d) / 2 * 0.6;
            P[i][0] -= dx / d * push; P[i][1] -= dy / d * push; P[j][0] += dx / d * push; P[j][1] += dy / d * push; moved = true;
          }
          P.forEach((p, i) => { p[0] = Math.max(R_[i] + 4, Math.min(Wd - R_[i] - 4, p[0])); p[1] = Math.max(R_[i] + 22, Math.min(Ht - R_[i] - 4, p[1])); });
          if (!moved) break;
        }
        P.forEach((p, i) => { nodes[i].x = p[0] / Wd; nodes[i].y = p[1] / Ht; });
      }
      function renderInfo() {
        const lab = S.labOrig(), n = G.nodes.length;
        const Q = modularity(n, G.edges, lab).Q, Qg = modularity(n, G.edges, lab, { gamma }).Q;
        const lines = [];
        const where = S.phase === "move" ? `${S.level + 1}. szint · ${S.rounds()}. kör · ${S.pos()}/${S.N()} ${S.level ? "szuperpont" : "csúcs"} megvizsgálva`
          : S.phase === "merge" ? `${S.level + 1}. szint · az 1. fázis véget ért (egy teljes körben senki sem mozdult)`
          : `${S.level + 1}. szint`;
        lines.push(where);
        lines.push(`Q = <b>${fmtS(Q)}</b>` + (Math.abs(gamma - 1) > 1e-9 ? ` · Q<sub>γ</sub> = <b>${fmtS(Qg)}</b>` : "") +
          ` · közösségek: <b>${nComm(lab)}</b> · áthelyezések eddig: <b>${S.totalMoves}</b>`);
        if (rec) {
          const nm = rec.self.length === 1 ? G.nodes[rec.self[0]].label : "szuperpont " + nameOf(rec.self);
          const tgt = rec.rows.find(r => r.c === rec.best);
          lines.push(rec.moved ? `Utolsó lépés: ${nm} → ${nameOf(tgt.mem)} (Q nő ${fmtS(rec.gain)}-del)` : `Utolsó lépés: ${nm} marad (nincs pozitív nyereség)`);
        }
        if (S.phase === "merge") lines.push("Jöhet az összevonás (2. fázis).");
        if (S.phase === "done") {
          lines.push("<b>Kész – nincs több javító lépés.</b>");
          const ok = Math.abs(S.ref.Q - Qg) < 1e-12 && S.ref.lab.every((x, i) => x === relabel(lab)[i]);
          root.dataset.check = ok ? "ok" : "diff";
          root.dataset.result = JSON.stringify({ Q: +Q.toFixed(4), Qg: +Qg.toFixed(4), k: nComm(lab), refQ: +S.ref.Q.toFixed(4), lab: relabel(lab) });
          if (chkDisc) {
            const bad = disconnectedComms(n, G.edges, lab);
            lines.push(bad.length ? bad.map(c => `A(z) ${nameOf([...Array(n).keys()].filter(i => lab[i] === c))} közösség nem összefüggő – ezt javítja a Leiden.`).join(" ")
              : "Minden közösség összefüggő.");
          }
        } else {
          delete root.dataset.check;
          if (chkDisc) lines.push("(Az összefüggőséget a végén ellenőrzöm.)");
        }
        info.innerHTML = lines.join("<br>");
      }
      function renderTable() {
        tbl.innerHTML = "";
        if (!rec || S.phase === "done" && !rec) return;
        const nm = rec.self.length === 1 ? G.nodes[rec.self[0]].label : nameOf(rec.self);
        const m = S.m2 / 2;
        const t = h("table", { style: "width:auto;min-width:min(100%,420px)" });
        t.append(h("tr", null, h("th", null, "célközösség"), h("th", { html: "$k_{i,C}$" }), h("th", { html: "$\\Sigma_{\\text{tot}}$" }),
          h("th", { html: "$\\Delta Q$" }), h("th", null, "a maradáshoz képest")));
        const stay = rec.rows[0].dQ;
        rec.rows.forEach(r => {
          const win = r.c === rec.best, col = commColor(rec.col(r.c));
          const tr = h("tr", { style: win ? "background:color-mix(in srgb, var(--accent) 16%, var(--card));font-weight:600" : "" },
            h("td", { html: sw(col) + (r.stay ? "marad: " : "") + nameOf(r.mem) }),
            h("td", { style: "font-family:var(--mono)" }, fmt(r.w, 2)), h("td", { style: "font-family:var(--mono)" }, fmt(r.tot, 2)),
            h("td", { style: "font-family:var(--mono)" }, fmtS(r.dQ)), h("td", { style: "font-family:var(--mono)" }, r.stay ? "0" : fmtP(r.dQ - stay)));
          t.append(tr);
        });
        const cap = h("p", { style: "margin:.6rem 0 .2rem;font-size:.92rem", html:
          `A vizsgált ${rec.self.length === 1 ? "csúcs" : "szuperpont"}: <b>${nm}</b>, $k_i = ${fmt(rec.ki, 2).replace(",", "{,}")}$, $m = ${fmt(m, 2).replace(",", "{,}")}$` +
          (Math.abs(gamma - 1) > 1e-9 ? `, $\\gamma = ${fmt(gamma, 1).replace(",", "{,}")}$` : "") +
          ` → ${rec.moved ? "átkerül a kiemelt közösségbe." : "marad (egyik csere sem javít)."}` });
        tbl.append(cap, t);
        math(tbl);
      }
      function act(what) {
        if (busy) return;
        if (what === "step") rec = S.step() || rec;
        else if (what === "phase") { while (S.phase === "move") rec = S.step(); }
        else if (what === "merge") return doMerge();
        else if (what === "all") {
          while (S.phase !== "done") { if (S.phase === "move") S.step(); else S.merge(); }
          rec = null;
        }
        render();
      }
      /* összevonás: a tagok a közösség súlypontjába csúsznak, majd szuperpontok lesznek */
      function doMerge() {
        busy = true;
        const lab = S.labOrig();
        const cen = new Map();
        lab.forEach((c, i) => { const p = cen.get(c) || [0, 0, 0]; p[0] += G.P0[i][0]; p[1] += G.P0[i][1]; p[2]++; cen.set(c, p); });
        let targets;
        if (superMode) {
          const mem = S.members();
          targets = view.nodes.map((_, s) => { const c = cen.get(lab[mem[s][0]]); return [c[0] / c[2], c[1] / c[2]]; });
        } else targets = lab.map(c => { const p = cen.get(c); return [p[0] / p[2], p[1] / p[2]]; });
        view.animateTo(targets, 650);
        setTimeout(() => { busy = false; S.merge(); rec = null; superMode = null; render(); }, 720);
      }
      build();
    };

    /* ------------------------------------------------------------------
       8.7: stabilitás – együttes-besorolási mátrix sok futásból
       ------------------------------------------------------------------ */
    W["stability-check"] = root => {
      header(root, "Mennyire stabil a felbontás?",
        "Ugyanazt az algoritmust sokszor lefuttatom, más-más véletlen sorrenddel. Az <b>együttes-besorolási mátrix</b> $C_{ij}$ eleme: " +
        "a futások hány százalékában került i és j egy közösségbe. A <b>konszenzus</b>: azok kerülnek egy csoportba, akik a futások több mint felében együtt voltak " +
        "($C_{ij} > 0{,}5$, láncolva). A csúcs <b>stabilitása</b>: a társaival (akikkel valaha együtt volt, vagy a konszenzusban együtt van) a futások hány százalékában ért egyet a konszenzussal.");
      math(root.querySelector(".w-sub"));
      const K = preset("karate", 0.62), LM = lesmisGraph(0.62);
      let ds = "karate", method = "louvain", runs = 20, gseed = 1, res = null, cancel = null;
      const DS = {
        karate: () => ({ n: 34, edges: K.edges.map(e => ({ a: e.a, b: e.b, w: 1 })), weighted: false, names: K.nodes.map(x => x.label), xy: K.nodes.map(x => [x.x, x.y]), club: K.club }),
        lesmis: () => ({ n: 77, edges: LM.edges, weighted: true, names: LM.nodes.map(x => x.name), xy: LM.nodes.map(x => [x.x, x.y]) }),
        random: () => {
          const E = gnm(34, 78, rng(gseed * 101 + 7)), P = GK.forceLayout(34, E.map(e => [e.a, e.b]), { seed: 3, aspect: 0.62 });
          return { n: 34, edges: E, weighted: false, names: [...Array(34).keys()].map(i => "v" + (i + 1)), xy: P };
        }
      };
      let G = DS[ds]();
      const c1 = h("div", { class: "controls" });
      const bNewG = btn("Új véletlen gráf", () => { gseed++; G = DS.random(); run(); });
      toggleGroup(c1, [["karate", "karateklub"], ["lesmis", "Les Misérables"], ["random", "véletlen G(34, 78)"]], ds, v => {
        ds = v; G = DS[v](); bNewG.style.display = v === "random" ? "" : "none"; run(); });
      c1.append(bNewG); bNewG.style.display = "none";
      const c2 = h("div", { class: "controls" });
      toggleGroup(c2, [["louvain", "Louvain"], ["lpa", "címketerjesztés"]], method, v => { method = v; run(); });
      c2.append(h("span", { class: "muted", style: "font-size:.9rem" }, "futások:"));
      toggleGroup(c2, [[10, "10"], [20, "20"], [50, "50"]], runs, v => { runs = v; run(); });
      const bRun = btn("Futtatás", () => run(), "btn primary");
      c2.append(bRun);
      root.append(c1, c2);
      const grid = h("div", { class: "two-col", style: "align-items:start" });
      const left = h("div"), right = h("div");
      grid.append(left, right);
      root.append(grid);
      left.append(h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }, "(a) Együttes-besorolási mátrix"));
      const hmBox = h("div");
      left.append(hmBox);
      const hmNote = h("p", { class: "muted", style: "font-size:.85rem;margin:.3rem 0 0" });
      const pairOut = h("div", { style: "font-family:var(--mono);font-size:.85rem;min-height:1.3em;overflow-wrap:anywhere" });
      left.append(hmNote, pairOut);
      right.append(h("div", { style: "font-weight:600;font-size:.92rem;margin-bottom:.2rem" }, "(b) Konszenzus a gráfon (halvány = instabil)"));
      const gBox = h("div");
      right.append(gBox);
      const weak = h("p", { style: "font-size:.88rem;margin:.3rem 0 0;overflow-wrap:anywhere" });
      right.append(weak);
      const info = h("div", { class: "readout" });
      const histBox = h("div", { style: "margin-top:.4rem" });
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Egy futás egy vélemény. Ami minden futásban együtt van, arra lehet építeni; a halvány csúcsok a határon állnak.");
      root.append(h("div", { style: "font-weight:600;font-size:.92rem;margin-top:.6rem" }, "(c) Összegzés"), info, histBox, lesson);

      const hm = canvasBox(hmBox, 1, 380);
      const view = new GK.View(gBox, { aspect: 0.62, radius: 6, maxW: 420 });
      const draw0 = view.draw.bind(view);
      view.draw = () => { recolor(); draw0(); };
      function recolor() {
        if (!res || !view.nodes.length) return;
        view.nodes.forEach((nd, i) => {
          const t = Math.max(0, Math.min(1, (res.stab[i] - 0.5) / 0.5));
          nd.color = mixColor("--card", commColor(res.cons[i]), 0.12 + 0.88 * t);
          nd.ink = t > 0.5 ? null : "--text";
        });
      }
      function setGraph() {
        const big = G.n > 40;
        view.o.radius = big ? 5 : (root.clientWidth < 560 ? 8 : 9);
        view.setGraph(G.xy.map((p, i) => ({ label: big ? "" : (ds === "karate" ? G.names[i] : String(i + 1)), x: p[0], y: p[1] })), G.edges);
        view.o.weightWidth = false;
      }
      function run() {
        if (cancel) cancel();
        const n = G.n, C = Array.from({ length: n }, () => new Float64Array(n)), labs = [], Qs = [];
        res = null; delete root.dataset.summary; setGraph(); drawHM(); pairOut.textContent = "";
        bRun.disabled = true;
        cancel = chunked(runs, method === "louvain" && n > 40 ? 2 : 5, r => {
          const R = rng(r + 1);
          const lab = method === "louvain" ? louvain(n, G.edges, { R, weighted: G.weighted }).lab : labelProp(n, G.edges, { R, weighted: G.weighted }).lab;
          labs.push(lab); Qs.push(modularity(n, G.edges, lab, { weighted: G.weighted }).Q);
          for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (lab[i] === lab[j]) { C[i][j]++; C[j][i]++; }
        }, done => { info.innerHTML = `Futás: ${done}/${runs}…`; }, () => {
          cancel = null; bRun.disabled = false;
          for (let i = 0; i < n; i++) { C[i][i] = runs; for (let j = 0; j < n; j++) C[i][j] /= runs; }
          const cons = consensusOf(n, C), stab = stabilityOf(n, C, cons);
          const order = [...Array(n).keys()].sort((a, b) => cons[a] - cons[b] || stab[b] - stab[a] || a - b);
          res = { C, labs, Qs, cons, stab, order };
          drawHM(); view.draw(); summarize();
        });
      }
      function drawHM() {
        const ctx = hm.ctx, Wd = hm.w, n = G.n;
        ctx.clearRect(0, 0, Wd, hm.h);
        if (!res) return;
        const club = ds === "karate", pad = club ? 8 : 0, cs = (Wd - pad) / n;
        const cells = {};
        for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) {
          const v = res.C[res.order[a]][res.order[b]], key = Math.round(v * 20);
          ctx.fillStyle = cells[key] || (cells[key] = mixColor("--card", "--accent", key / 20));
          ctx.fillRect(pad + b * cs, pad + a * cs, cs + 0.5, cs + 0.5);
        }
        /* a konszenzus-közösségek határa */
        ctx.strokeStyle = GK.css("--text"); ctx.lineWidth = 1.2;
        let s = 0;
        for (let a = 1; a <= n; a++) {
          if (a === n || res.cons[res.order[a]] !== res.cons[res.order[a - 1]]) {
            ctx.strokeRect(pad + s * cs, pad + s * cs, (a - s) * cs, (a - s) * cs); s = a;
          }
        }
        if (club) {                                        // a valódi kettéválás sávja
          const dark = GK.css("--text"), light = GK.css("--border");
          res.order.forEach((v, a) => {
            ctx.fillStyle = G.club[v] === 0 ? dark : light;
            ctx.fillRect(pad + a * cs, 0, cs + 0.3, pad - 2); ctx.fillRect(0, pad + a * cs, pad - 2, cs + 0.3);
          });
        }
      }
      hm.onResize = () => drawHM();
      const pick = ev => {
        if (!res) return;
        const r = hm.c.getBoundingClientRect(), pad = ds === "karate" ? 8 : 0, cs = (hm.w - pad) / G.n;
        const b = Math.floor((ev.clientX - r.left - pad) / cs), a = Math.floor((ev.clientY - r.top - pad) / cs);
        if (a < 0 || b < 0 || a >= G.n || b >= G.n) return;
        const i = res.order[a], j = res.order[b];
        pairOut.textContent = `${G.names[i]} – ${G.names[j]}: ${pct(res.C[i][j])} (${Math.round(res.C[i][j] * runs)}/${runs} futás)`;
        view.hl = new Set([i, j]); view.dim = true; view.draw();
      };
      hm.c.addEventListener("pointerdown", pick);
      hm.c.addEventListener("pointermove", ev => { if (ev.buttons || ev.pointerType === "mouse") pick(ev); });
      hm.c.addEventListener("pointerleave", () => { view.hl = new Set(); view.dim = false; view.draw(); });
      function summarize() {
        const { Qs, labs, cons, stab } = res, n = G.n;
        const ks = labs.map(nComm), kc = new Map();
        ks.forEach(k => kc.set(k, (kc.get(k) || 0) + 1));
        let sN = 0, cN = 0;
        for (let a = 0; a < labs.length; a++) for (let b = a + 1; b < labs.length; b++) { sN += nmi(labs[a], labs[b]); cN++; }
        const lines = [];
        lines.push(`Q: min <b>${fmt(Math.min(...Qs), 3)}</b> · medián <b>${fmt(median(Qs), 3)}</b> · átlag <b>${fmt(meanSd(Qs).mean, 3)}</b> · max <b>${fmt(Math.max(...Qs), 3)}</b>`);
        lines.push("közösségszám: " + [...kc.entries()].sort((a, b) => b[1] - a[1] || a[0] - b[0]).map(([k, c]) => `<b>${k}</b> → ${runs}-ból ${c}-szor`).join(" · "));
        lines.push(`a futások páronkénti átlagos NMI-je: <b>${fmt(cN ? sN / cN : 1, 3)}</b>`);
        const Qc = modularity(n, G.edges, cons, { weighted: G.weighted }).Q;
        lines.push(`konszenzus: <b>${nComm(cons)}</b> közösség, Q = <b>${fmt(Qc, 3)}</b>`);
        if (ds === "karate") {
          const nm = labs.map(l => nmi(G.club, l)), ar = labs.map(l => ari(G.club, l));
          lines.push(`a valódi kettéváláshoz képest: átlagos NMI <b>${fmt(meanSd(nm).mean, 3)}</b>, ARI <b>${fmt(meanSd(ar).mean, 3)}</b>`);
          lines.push(`a valódi kettéválás modularitása: <b>${fmt(modularity(34, G.edges, G.club).Q, 3)}</b>`);
        }
        if (ds === "random") {
          const best = Qs.slice().sort((a, b) => b - a).slice(0, 5);
          lines.push(`Ez <b>véletlen</b> gráf, mégis Q ≈ <b>${fmt(meanSd(best).mean, 2)}</b> (a legjobb 5 futás átlaga) – ` +
            `a valódi kettéválás modularitása a karateklubon 0,358. A magas Q önmagában nem bizonyíték!`);
        }
        info.innerHTML = lines.join("<br>");
        /* Q-hisztogram */
        const lo = Math.min(...Qs), hi = Math.max(...Qs), B = 12, span = hi - lo, cnt = new Array(B).fill(0);
        Qs.forEach(q => cnt[span < 1e-9 ? B - 1 : Math.min(B - 1, Math.floor((q - lo) / span * B))]++);
        const Wd = 360, Ht = 90, L = 8, bw = (Wd - 2 * L) / B, mx = Math.max(...cnt);
        let g = "";
        cnt.forEach((c, b) => { if (c) { const hh = (Ht - 30) * c / mx; g += `<rect x="${L + b * bw + 1}" y="${Ht - 18 - hh}" width="${bw - 2}" height="${hh}" fill="var(--accent)" opacity=".75"><title>${c}</title></rect>`; } });
        g += `<line x1="${L}" y1="${Ht - 18}" x2="${Wd - L}" y2="${Ht - 18}" stroke="var(--border)"/>`;
        g += `<text x="${L}" y="${Ht - 4}" font-size="10.5" fill="var(--muted)">${span < 1e-9 ? "minden futás: Q = " + fmt(lo, 3) : fmt(lo, 3)}</text>`;
        if (span >= 1e-9) g += `<text x="${Wd - L}" y="${Ht - 4}" font-size="10.5" fill="var(--muted)" text-anchor="end">${fmt(hi, 3)}</text>`;
        g += `<text x="${Wd / 2}" y="10" font-size="10.5" fill="var(--muted)" text-anchor="middle">a Q-értékek eloszlása (${runs} futás)</text>`;
        histBox.innerHTML = `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block" role="img" aria-label="Q hisztogram">${g}</svg>`;
        /* a legkevésbé stabil csúcsok */
        const ws = [...Array(n).keys()].sort((a, b) => stab[a] - stab[b] || a - b).slice(0, 5);
        weak.innerHTML = "A legkevésbé stabil csúcsok: " + ws.map(i => `${sw(commColor(cons[i]))}<b>${G.names[i]}</b> (${pct(stab[i])})`).join(", ") + ".";
        hmNote.innerHTML = "A csúcsok a konszenzus-közösségek szerint rendezve (keretben), azon belül a stabilitás szerint; erősebb színű cella = gyakrabban együtt. " +
          (ds === "karate" ? "A szélső sáv a valódi kettéválás: erős sáv = Mr. Hi csoportja, halvány = az elnöké. " : "") + "Koppints egy cellára!";
        root.dataset.summary = JSON.stringify({ Qmin: Math.min(...Qs), Qmax: Math.max(...Qs), Qmean: meanSd(Qs).mean, ks: [...kc.entries()], nmi: cN ? sN / cN : 1 });
      }
      run();
    };

    /* ------------------------------------------------------------------
       8.6: sztochasztikus blokkmodell
       ------------------------------------------------------------------ */
    W["sbm-generator"] = root => {
      header(root, "Sztochasztikus blokkmodell (SBM)",
        "A csúcsok blokkokba tartoznak; két csúcs között $p_{rs}$ eséllyel van él, ahol r és s a két csúcs blokkja. " +
        "Állítsd be a blokkmátrixot, és nézd meg, mit talál a Louvain! A töltés a <b>valódi blokk</b>, a gyűrű a <b>Louvain közössége</b> " +
        "(a legjobban illeszkedő blokk színével – ahol a gyűrű és a töltés színe egyezik, ott eltalálta).");
      math(root.querySelector(".w-sub"));
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.9 : 0.55;
      let K = 2, sizes = [15, 15, 15], P = [[0.5, 0.05, 0.05], [0.05, 0.5, 0.05], [0.05, 0.05, 0.5]], seed = 1, shuffled = false, Gs = null, lv = null, perm = null;
      const c1 = h("div", { class: "controls" });
      const paintK = toggleGroup(c1, [[2, "2 blokk"], [3, "3 blokk"]], K, v => { K = v; buildCtrl(); gen(); });
      const c2 = h("div", { class: "controls" });
      c2.append(h("span", { class: "muted", style: "font-size:.9rem" }, "előbeállítás:"));
      const setAll = (pin, pout) => { for (let r = 0; r < 3; r++) for (let s = 0; s < 3; s++) P[r][s] = r === s ? pin : pout; };
      const PRE = {
        comm: () => { setAll(0.5, 0.05); },
        cp: () => { K = 2; sizes[0] = 8; sizes[1] = 22; P[0][0] = 0.8; P[0][1] = P[1][0] = 0.3; P[1][1] = 0.02; },
        bip: () => { K = 2; sizes[0] = sizes[1] = 15; setAll(0.02, 0.3); },
        none: () => { setAll(0.15, 0.15); }
      };
      [["comm", "közösségek"], ["cp", "mag–periféria"], ["bip", "kétrészes"], ["none", "nincs szerkezet"]].forEach(([k, l]) =>
        c2.append(btn(l, () => { PRE[k](); paintK(K); buildCtrl(); gen(); })));
      const sizeBox = h("div", { class: "controls" });
      const matBox = h("div", { class: "tw", style: "overflow-x:auto" });
      const c3 = h("div", { class: "controls" });
      const seedOut = h("b", { style: "font-family:var(--mono)" }, "1");
      c3.append(h("label", null, "minta:", seedOut), btn("Új minta", () => { seed++; seedOut.textContent = seed; gen(); }, "btn primary"));
      root.append(c1, c2, sizeBox, matBox, c3);
      const gBox = h("div");
      const legend = h("p", { class: "muted", style: "font-size:.88rem;margin:.3rem 0 0" });
      root.append(gBox, legend);
      const grid = h("div", { class: "two-col", style: "align-items:start;margin-top:.5rem" });
      const left = h("div"), right = h("div");
      grid.append(left, right); root.append(grid);
      const ordCtl = h("div", { class: "controls", style: "margin:.2rem 0" });
      ordCtl.append(h("span", { style: "font-weight:600;font-size:.92rem" }, "Szomszédsági mátrix:"));
      toggleGroup(ordCtl, [[false, "blokkok szerint"], [true, "véletlen sorrend"]], shuffled, v => { shuffled = v; drawMat(); });
      left.append(ordCtl);
      const mBox = h("div");
      left.append(mBox);
      const tblBox = h("div", { class: "tw", style: "overflow-x:auto" });
      const info = h("div", { class: "readout" });
      right.append(tblBox, info);
      const lesson = h("p", { style: "margin:.5rem 0 0;font-weight:600" },
        "Az SBM nem azt kérdezi, hol sűrű a gráf, hanem azt, kik viselkednek egyformán: kivel és milyen eséllyel kapcsolódnak.");
      root.append(lesson);
      /* kimutathatóság */
      const det = h("div", { style: "margin-top:.9rem;border-top:1px solid var(--border);padding-top:.6rem" });
      root.append(det);
      const detHead = h("p", { style: "margin:.2rem 0", html:
        "<b>Kimutathatóság.</b> Két egyenlő blokk ($n = 2\\times 50$), rögzített átlagos fokszám ($\\langle k\\rangle = 6$), " +
        "és egyre kevésbé különbözik a blokkon belüli és a blokkok közti esély: $\\epsilon = p_{\\text{ki}}/p_{\\text{be}}$. " +
        "Ritka gráfban van egy határ, ahol túl ezen semmilyen módszer nem találja meg a blokkokat (Decelle és mtsai, 2011): " +
        "$|c_{\\text{be}} - c_{\\text{ki}}| > 2\\sqrt{\\langle k\\rangle}$, ahol $c = p \\cdot n$. Itt ez $\\epsilon^* = \\dfrac{6-\\sqrt6}{6+\\sqrt6} \\approx 0{,}42$." });
      const detCtl = h("div", { class: "controls" });
      const detOut = h("span", { class: "muted", style: "font-size:.9rem" });
      const bDet = btn("Görbe számolása (21 × 5 minta)", () => runDet());
      detCtl.append(bDet, detOut);
      const detSvg = h("div");
      det.append(detHead, detCtl, detSvg);
      math(det);

      const view = new GK.View(gBox, {
        aspect, radius: narrow ? 5 : 6,
        onDraw: (ctx, v) => {
          if (!lv) return;
          v.nodes.forEach((nd, i) => {
            const [x, y] = v.px(nd);
            ctx.beginPath(); ctx.arc(x, y, v.o.radius + 3.2, 0, 2 * Math.PI);
            ctx.lineWidth = 2.6; ctx.strokeStyle = GK.color(commColor(lv.col[i])); ctx.stroke();
          });
        }
      });
      const mat = canvasBox(mBox, 1, 320);
      mat.onResize = () => drawMat();

      function buildCtrl() {
        sizeBox.innerHTML = "";
        for (let b = 0; b < K; b++) {
          const out = h("b", { style: "font-family:var(--mono);min-width:1.4em" }, String(sizes[b]));
          const sl = h("input", { type: "range", min: 5, max: 30, step: 1, value: sizes[b], "aria-label": `${b + 1}. blokk mérete`, style: "width:7rem",
            oninput: () => { sizes[b] = +sl.value; out.textContent = sl.value; gen(); } });
          sizeBox.append(h("label", { html: `${sw(commColor(b))}${b + 1}. blokk:` }, sl, out));
        }
        matBox.innerHTML = "";
        const t = h("table", { style: "width:auto" });
        t.append(h("tr", null, h("th", { html: "$p_{rs}$" }), ...[...Array(K).keys()].map(s => h("th", { html: `${sw(commColor(s))}${s + 1}.` }))));
        const outs = [];
        for (let r = 0; r < K; r++) {
          const tr = h("tr", null, h("th", { html: `${sw(commColor(r))}${r + 1}.` }));
          for (let s = 0; s < K; s++) {
            const o = h("b", { style: "font-family:var(--mono);display:inline-block;min-width:2.6em" }, fmt(P[r][s], 2));
            outs.push([r, s, o]);
            const td = h("td", { style: "white-space:nowrap" });
            if (s >= r) {
              const sl = h("input", { type: "range", min: 0, max: 1, step: 0.01, value: P[r][s], "aria-label": `p ${r + 1}–${s + 1}`, style: `width:${narrow ? 3.6 : 5.5}rem;vertical-align:middle`,
                oninput: () => { P[r][s] = P[s][r] = +sl.value; outs.forEach(([a, b, el]) => (el.textContent = fmt(P[a][b], 2))); gen(); } });
              td.append(sl, " ", o);
            } else { td.append(o); td.style.color = "var(--muted)"; td.title = "szimmetrikus"; }
            tr.append(td);
          }
          t.append(tr);
        }
        matBox.append(t);
        math(matBox);
      }
      function gen() {
        const sz = sizes.slice(0, K), PP = P.slice(0, K).map(r => r.slice(0, K));
        Gs = sbm(sz, PP, rng(seed * 7919 + 13));
        const n = Gs.n;
        /* elrendezéshez a kis komponenseket (izolált csúcsokat) egy-egy láthatatlan éllel a legnagyobbhoz kötöm */
        const LE = Gs.edges.map(e => [e.a, e.b]), cc = components(n, Gs.edges).comp, csz = new Map();
        cc.forEach(c => csz.set(c, (csz.get(c) || 0) + 1));
        const bigC = [...csz.keys()].sort((a, b) => csz.get(b) - csz.get(a))[0], bigV = [...Array(n).keys()].filter(i => cc[i] === bigC), seen = new Set([bigC]);
        for (let i = 0; i < n; i++) if (!seen.has(cc[i])) { seen.add(cc[i]); LE.push([i, bigV[(i * 7) % bigV.length]]); }
        const L = GK.forceLayout(n, LE, { seed: 7, aspect, iters: 300 });
        const lres = louvain(n, Gs.edges, { R: rng(seed) });
        lv = { lab: lres.lab, Q: lres.Q, col: matchColors(Gs.block, lres.lab, K), nmi: nmi(Gs.block, lres.lab), k: nComm(lres.lab) };
        view.setGraph(L.map((p, i) => ({ label: "", x: p[0], y: p[1], color: commColor(Gs.block[i]) })), Gs.edges);
        const R = rng(seed + 99);
        perm = [...Array(n).keys()];
        for (let i = n - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [perm[i], perm[j]] = [perm[j], perm[i]]; }
        drawMat(); renderTable();
        legend.innerHTML = "Töltés: valódi blokk (" + [...Array(K).keys()].map(b => `${sw(commColor(b))}${b + 1}.`).join(" ") + "); gyűrű: a Louvain közössége.";
      }
      function drawMat() {
        const ctx = mat.ctx, Wd = mat.w;
        ctx.clearRect(0, 0, Wd, mat.h);
        if (!Gs) return;
        const n = Gs.n, cs = Wd / n, ord = shuffled ? perm : [...Array(n).keys()], at = new Array(n);
        ord.forEach((v, a) => (at[v] = a));
        ctx.fillStyle = mixColor("--card", "--muted", 0.08); ctx.fillRect(0, 0, Wd, Wd);
        ctx.fillStyle = GK.css("--text");
        Gs.edges.forEach(e => {
          const a = at[e.a], b = at[e.b];
          ctx.fillRect(b * cs, a * cs, Math.max(1, cs), Math.max(1, cs)); ctx.fillRect(a * cs, b * cs, Math.max(1, cs), Math.max(1, cs));
        });
        if (!shuffled) {
          ctx.strokeStyle = GK.css("--accent"); ctx.lineWidth = 1;
          let s = 0;
          sizes.slice(0, K).forEach((z, b) => {
            if (b) { ctx.beginPath(); ctx.moveTo(s * cs, 0); ctx.lineTo(s * cs, Wd); ctx.moveTo(0, s * cs); ctx.lineTo(Wd, s * cs); ctx.stroke(); }
            s += z;
          });
        }
        ctx.strokeStyle = GK.css("--border"); ctx.strokeRect(0.5, 0.5, Wd - 1, Wd - 1);
      }
      function renderTable() {
        const sz = sizes.slice(0, K), Ex = sbmExpected(sz, P), act = Array.from({ length: K }, () => new Array(K).fill(0));
        Gs.edges.forEach(e => { const r = Math.min(Gs.block[e.a], Gs.block[e.b]), s = Math.max(Gs.block[e.a], Gs.block[e.b]); act[r][s]++; });
        const t = h("table", { style: "width:auto" });
        t.append(h("tr", null, h("th", null, "blokkpár"), h("th", null, "p"), h("th", null, "várható él"), h("th", null, "kapott él")));
        for (let r = 0; r < K; r++) for (let s = r; s < K; s++)
          t.append(h("tr", null, h("td", { html: `${sw(commColor(r))}${r + 1}–${sw(commColor(s))}${s + 1}` }), h("td", { style: "font-family:var(--mono)" }, fmt(P[r][s], 2)),
            h("td", { style: "font-family:var(--mono)" }, fmt(Ex[r][s], 1)), h("td", { style: "font-family:var(--mono)" }, String(act[r][s]))));
        tblBox.innerHTML = ""; tblBox.append(t);
        info.innerHTML = `n = <b>${Gs.n}</b> csúcs, <b>${Gs.edges.length}</b> él<br>` +
          `Louvain: <b>${lv.k}</b> közösség, Q = <b>${fmt(lv.Q, 3)}</b><br>NMI a valódi blokkokhoz: <b>${fmt(lv.nmi, 2)}</b>` +
          (lv.nmi < 0.3 ? "<br>A Louvain itt <b>nem</b> a valódi blokkokat találja: a modularitás csak az „egymás közt sűrű” csoportokat keresi." : "");
        root.dataset.result = JSON.stringify({ n: Gs.n, m: Gs.edges.length, k: lv.k, Q: lv.Q, nmi: lv.nmi, exp: Ex, act });
      }
      /* kimutathatósági görbe (darabolva) */
      let detCancel = null;
      const EPS = [...Array(21).keys()].map(i => i / 20), REP = 5, EST = (6 - Math.sqrt(6)) / (6 + Math.sqrt(6));
      function runDet() {
        if (detCancel) detCancel();
        const blk = [...Array(100).keys()].map(i => (i < 50 ? 0 : 1)), acc = EPS.map(() => ({ l: 0, s: 0 }));
        bDet.disabled = true;
        detCancel = chunked(EPS.length * REP, 3, t => {
          const e = EPS[Math.floor(t / REP)], r = t % REP, pin = 6 / (49 + 50 * e), pout = e * pin;
          const G2 = sbm([50, 50], [[pin, pout], [pout, pin]], rng(5000 + 97 * t));
          acc[Math.floor(t / REP)].l += nmi(blk, louvain(100, G2.edges, { R: rng(r + 1) }).lab) / REP;
          acc[Math.floor(t / REP)].s += nmi(blk, spectralSplit(100, G2.edges, "modmat").lab) / REP;
        }, d => { detOut.textContent = `számolom: ${d}/${EPS.length * REP} minta`; drawDet(acc, Math.floor(d / REP)); },
        () => { detCancel = null; bDet.disabled = false; detOut.textContent = "kész (minden pont 5 minta átlaga). A Louvain már ε = 0-nál is több darabra vágja a blokkokat, ezért indul 1 alatt; a spektrális kettévágás eleve két részt keres.";
          root.dataset.det = JSON.stringify(acc.map((a, i) => [EPS[i], +a.l.toFixed(3), +a.s.toFixed(3)])); });
      }
      function drawDet(acc, upto) {
        const Wd = 520, Ht = 240, L = 40, Rm = 12, T = 12, B = 36;
        const X = e => L + e * (Wd - L - Rm), Y = v => Ht - B - v * (Ht - T - B);
        let g = `<rect x="${L}" y="${T}" width="${Wd - L - Rm}" height="${Ht - T - B}" fill="none" stroke="var(--border)"/>`;
        for (let v = 0; v <= 1.001; v += 0.25) g += `<line x1="${L}" y1="${Y(v)}" x2="${Wd - Rm}" y2="${Y(v)}" stroke="var(--border)" stroke-width=".6"/><text x="${L - 5}" y="${Y(v) + 3.5}" text-anchor="end" font-size="10.5" fill="var(--muted)">${fmt(v, 2)}</text>`;
        for (let e = 0; e <= 1.001; e += 0.2) g += `<text x="${X(e)}" y="${Ht - B + 14}" text-anchor="middle" font-size="10.5" fill="var(--muted)">${fmt(e, 1)}</text>`;
        g += `<text x="${(L + Wd - Rm) / 2}" y="${Ht - 6}" text-anchor="middle" font-size="11" fill="var(--muted)">ε = p_ki / p_be</text>`;
        g += `<text x="12" y="${(T + Ht - B) / 2}" text-anchor="middle" font-size="11" fill="var(--muted)" transform="rotate(-90 12 ${(T + Ht - B) / 2})">NMI</text>`;
        g += `<line x1="${X(EST)}" y1="${T}" x2="${X(EST)}" y2="${Ht - B}" stroke="var(--text)" stroke-dasharray="5 4"/><text x="${X(EST) + 4}" y="${T + 12}" font-size="10.5" fill="var(--text)">ε* ≈ 0,42</text>`;
        const line = (k, col, dash) => {
          const pts = acc.slice(0, upto).map((a, i) => [X(EPS[i]), Y(a[k])]);
          if (!pts.length) return "";
          return `<polyline points="${pts.map(p => p.join(",")).join(" ")}" fill="none" stroke="${col}" stroke-width="2" ${dash ? 'stroke-dasharray="4 3"' : ""}/>` +
            pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="2.8" fill="${col}"/>`).join("");
        };
        g += line("s", "var(--muted)", true) + line("l", "var(--accent)", false);
        g += `<g font-size="10.5"><line x1="${Wd - Rm - 190}" y1="${T + 30}" x2="${Wd - Rm - 172}" y2="${T + 30}" stroke="var(--accent)" stroke-width="2"/><text x="${Wd - Rm - 168}" y="${T + 33}" fill="var(--text)">Louvain</text>` +
          `<line x1="${Wd - Rm - 190}" y1="${T + 46}" x2="${Wd - Rm - 172}" y2="${T + 46}" stroke="var(--muted)" stroke-width="2" stroke-dasharray="4 3"/><text x="${Wd - Rm - 168}" y="${T + 49}" fill="var(--text)">spektrális kettévágás</text></g>`;
        detSvg.innerHTML = `<svg viewBox="0 0 ${Wd} ${Ht}" style="width:100%;max-width:${Wd}px;display:block" role="img" aria-label="kimutathatósági görbe">${g}</svg>`;
      }
      drawDet(EPS.map(() => ({ l: 0, s: 0 })), 0);
      buildCtrl(); gen();
    };
  }
