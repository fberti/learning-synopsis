/* =========================================================
   Gráfelmélet és hálózattudomány 2. fejezet – interaktív szemléltetések
   Minden widget egy  <div class="widget" data-widget="név">  elembe épül.
   Közös alap: assets/graph.js (GraphKit), adatok: ../arvizhet-data.js (ARVIZHET)
   ========================================================= */
(function () {
  "use strict";
  const GK = window.GraphKit, D = window.ARVIZHET;
  const fmt = (x, d = 2) => (isFinite(x) ? (+x.toFixed(d)).toString().replace(".", ",") : "–");

  function h(tag, attrs, ...kids) {
    const e = document.createElement(tag);
    if (attrs) for (const [k, v] of Object.entries(attrs)) {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else if (k.startsWith("on")) e.addEventListener(k.slice(2), v);
      else e.setAttribute(k, v);
    }
    kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c)));
    return e;
  }
  const btn = (label, onclick, cls = "btn") => h("button", { class: cls, type: "button", onclick }, label);
  function header(root, title, sub) {
    root.append(h("div", { class: "w-title" }, title));
    if (sub) root.append(h("p", { class: "w-sub", html: sub }));
  }
  /* gombcsoport, amelyből egy aktív */
  function toggleGroup(parent, items, cur, onpick) {
    const bs = items.map(([v, l]) => btn(l, () => { onpick(v); paint(v); }));
    const paint = v => bs.forEach((b, i) => b.classList.toggle("on", items[i][0] === v));
    paint(cur);
    parent.append(...bs);
    return paint;
  }
  const math = el => window.Synopsis && Synopsis.renderMath && window.renderMathInElement && Synopsis.renderMath(el);
  const binom2 = n => n * (n - 1) / 2;

  /* az Árvízhét szereplőinek rögzített elrendezése (ugyanaz, mint a szöveg ábráin) */
  const ACTOR_POS = { Kl: [0.6, 0], Sz: [0, 0.5], Ko: [1.3, 0.5], Vi: [0.65, 1], Po: [1.6, 1.3], La: [2.4, 1], "Ön": [2.3, 1.9] };
  function actorPositions(aspect) {
    const ids = D.actors.map(a => a.id);
    const P = GK.normalize(ids.map(i => ACTOR_POS[i]), aspect);
    const o = {}; ids.forEach((id, k) => (o[id] = P[k])); return o;
  }
  const actorName = id => D.actors.find(a => a.id === id).name;
  const paper = id => D.papers.find(p => p.id === id);

  /* együttes említési gráf a kijelölt cikkekből: {pairs: {"Ko|Vi": [cikk-id-k]}} */
  function cooc(arts) {
    const pairs = {};
    arts.forEach(a => {
      const m = a.mentions;
      for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) {
        const ia = D.actors.findIndex(x => x.id === m[i]), ib = D.actors.findIndex(x => x.id === m[j]);
        const k = ia < ib ? m[i] + "|" + m[j] : m[j] + "|" + m[i];
        (pairs[k] = pairs[k] || []).push(a.id);
      }
    });
    return pairs;
  }

  /* az Árvízhét teljes szereplőgráfja: {ids, nodes(aspect), edges [{a,b,w}]} */
  function arvizGraph(aspect) {
    const pos = actorPositions(aspect), ids = D.actors.map(a => a.id), pairs = cooc(D.articles);
    return {
      ids,
      nodes: ids.map(id => ({ label: id, x: pos[id][0], y: pos[id][1], sub: actorName(id) })),
      edges: Object.entries(pairs).map(([k, l]) => { const [u, v] = k.split("|"); return { a: ids.indexOf(u), b: ids.indexOf(v), w: l.length }; })
    };
  }
  /* komponensek: csúcsonként a komponens sorszáma */
  function componentsOf(n, edges, removed = new Set()) {
    const L = GK.adjList(n, edges), comp = new Array(n).fill(-1); let c = 0;
    for (let s = 0; s < n; s++) {
      if (comp[s] >= 0 || removed.has(s)) continue;
      const st = [s]; comp[s] = c;
      while (st.length) { const u = st.pop(); L[u].forEach(v => { if (comp[v] < 0 && !removed.has(v)) { comp[v] = c; st.push(v); } }); }
      c++;
    }
    return { comp, count: c };
  }
  /* BFS-távolságok egy csúcsból (Infinity, ha nem elérhető) */
  function bfsDist(n, edges, s) {
    const L = GK.adjList(n, edges), d = new Array(n).fill(Infinity); d[s] = 0; const q = [s];
    while (q.length) { const u = q.shift(); L[u].forEach(v => { if (d[v] === Infinity) { d[v] = d[u] + 1; q.push(v); } }); }
    return d;
  }
  const COMP_COLORS = ["--setA", "--setB", "--setC", "#a855f7", "#ef4444", "#14b8a6", "#eab308"];

  const W = {};
  /* ==================================================================
     w2: 2.4–2.7 widgetjei (dijkstra-step, spanning-tree, euler-trail, walk-counter)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    /* a 2.4 öt települése (a 04-s24.html ábrájának elrendezése) */
    const TOWN_IDS = ["Sze", "Hmv", "Mak", "Kis", "Csg"];
    const TOWN_NAMES = { Sze: "Szeged", Hmv: "Hódmezővásárhely", Mak: "Makó", Kis: "Kistelek", Csg: "Csongrád" };
    const TOWN_POS = { Sze: [1, 1.2], Hmv: [1.6, 0.3], Mak: [2.4, 1.4], Kis: [0, 0.6], Csg: [0.9, -0.4] };
    const TOWN_EDGES = [["Sze", "Hmv", 25], ["Sze", "Mak", 33], ["Hmv", "Mak", 30], ["Sze", "Kis", 30], ["Kis", "Csg", 36], ["Hmv", "Csg", 37]];
    function townGraph(aspect) {
      const P = GK.normalize(TOWN_IDS.map(id => TOWN_POS[id]), aspect);
      return lift({
        ids: TOWN_IDS,
        nodes: TOWN_IDS.map((id, i) => ({ label: id, x: P[i][0], y: P[i][1], sub: TOWN_NAMES[id] })),
        edges: TOWN_EDGES.map(([u, v, w]) => ({ a: TOWN_IDS.indexOf(u), b: TOWN_IDS.indexOf(v), w }))
      });
    }
    /* a csúcsok alatti név (sub) ne lógjon le a vászonról: a függőleges tartomány kicsit feljebb húzva */
    const lift = g => { g.nodes.forEach(n => (n.y = 0.07 + (n.y - 0.08) * 0.93)); return g; };
    const num = x => (x === Infinity ? "∞" : fmt(x, 2));
    const stat = (parent, list) => {
      parent.innerHTML = "";
      list.forEach(([l, v]) => parent.append(h("div", { class: "stat" }, h("div", { class: "v" }, String(v)), h("div", { class: "l" }, l))));
    };

    /* ------------------------------------------------------------------
       2.4  dijkstra-step – Dijkstra-algoritmus lépésenként
       ------------------------------------------------------------------ */
    W["dijkstra-step"] = root => {
      header(root, "Dijkstra lépésről lépésre",
        "Kattints egy csúcsra: az lesz a kezdőcsúcs. A „Lépés” egy csúcsot véglegesít. A csúcs melletti szám az ideiglenes címke; a <b>zöld</b> csúcsok véglegesek, a zöld élek a legrövidebb utak fája.");
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      let ds = "town", mode = "w", src = 0, tgt = 4, G = null, len = [];
      toggleGroup(ctr, [["town", "Települések (km)"], ["arviz", "Árvízhét"]], ds, v => { ds = v; build(true); });
      const modeBox = h("span", { class: "controls", style: "margin:0" });
      toggleGroup(modeBox, [["w", "hossz = súly"], ["inv", "hossz = 1/súly"]], mode, v => { mode = v; build(false); });
      ctr.append(modeBox);
      const tgtSel = h("select", { onchange: () => { tgt = +tgtSel.value; paint(); } });
      ctr2.append(btn("Lépés", () => { step(); paint(); }, "btn primary"), btn("Végig", () => { while (step()); paint(); }), btn("Újra", () => { reset(); paint(); }),
        h("label", null, "célcsúcs: ", tgtSel));
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect: 0.55, radius: 17, showWeights: true, draggable: false,
        onNodeClick: i => { src = i; if (tgt === i) tgt = -1; reset(); fillTargets(); paint(); } });
      const msg = h("p", { class: "readout" }), path = h("p", { class: "readout" }), stats = h("div", { class: "stat-row" });
      const tab = h("div", { style: "overflow-x:auto;margin-top:.6rem" });
      root.append(msg, path, stats, tab);

      let dist, fin, par, rows, last, done;
      function build(newData) {
        G = ds === "town" ? townGraph(view.o.aspect) : lift(arvizGraph(view.o.aspect));
        modeBox.style.display = ds === "arviz" ? "" : "none";
        if (newData) { src = ds === "town" ? 0 : G.ids.indexOf("Kl"); tgt = ds === "town" ? 4 : G.ids.indexOf("La"); }
        const inv = ds === "arviz" && mode === "inv";
        len = G.edges.map(e => (inv ? 1 / e.w : e.w));
        view.setGraph(G.nodes, G.edges.map((e, i) => ({ ...e, label: num(len[i]) })));
        fillTargets(); reset(); paint();
      }
      function fillTargets() {
        tgtSel.innerHTML = "";
        tgtSel.append(h("option", { value: -1 }, "–"), ...G.ids.map((id, i) => (i === src ? null : h("option", { value: i }, id))).filter(Boolean));
        tgtSel.value = String(tgt);
      }
      function reset() {
        const n = G.ids.length;
        dist = new Array(n).fill(Infinity); dist[src] = 0;
        fin = new Array(n).fill(false); par = new Array(n).fill(-1); rows = []; last = -1; done = false;
      }
      function step() {
        if (done) return false;
        let u = -1;
        dist.forEach((d, i) => { if (!fin[i] && d < Infinity && (u < 0 || d < dist[u] - 1e-9)) u = i; });
        if (u < 0) { done = true; return false; }
        fin[u] = true; last = u;
        const changed = new Set(), worse = {}, prevFin = fin.map((f, i) => f && i !== u);
        G.edges.forEach((e, k) => {
          if (e.a !== u && e.b !== u) return;
          const v = e.a === u ? e.b : e.a;
          if (fin[v]) return;
          const c = dist[u] + len[k];
          if (c < dist[v] - 1e-9) { dist[v] = c; par[v] = k; changed.add(v); worse[v] = undefined; }
          else worse[v] = c;
        });
        rows.push({ u, du: dist[u], cells: G.ids.map((_, v) => {
          if (v === src) return null;
          if (v === u) return `<b>${num(dist[v])}</b>`;
          if (prevFin[v]) return "–";
          let s = changed.has(v) ? `<span style="color:var(--accent);font-weight:700">${num(dist[v])}</span>` : num(dist[v]);
          if (worse[v] !== undefined) s += ` <span class="muted">(${num(worse[v])} nem jobb)</span>`;
          return s;
        }) });
        if (fin.every((f, i) => f || dist[i] === Infinity)) done = true;
        return true;
      }
      function pathTo(t) {
        const p = [t], es = [];
        while (par[p[0]] >= 0) { const e = G.edges[par[p[0]]]; es.unshift(par[p[0]]); p.unshift(e.a === p[0] ? e.b : e.a); }
        return { p, es };
      }
      function paint() {
        const ids = G.ids;
        view.nodes.forEach((nd, i) => {
          nd.badge = num(dist[i]);
          nd.color = fin[i] ? "--setC" : null;
          nd.sub = (G.nodes[i].sub || "") + (i === tgt ? " 🎯" : "");
        });
        view.hl.clear(); if (last >= 0) view.hl.add(last);
        const onPath = new Set(tgt >= 0 && dist[tgt] < Infinity ? pathTo(tgt).es : []);
        view.edges.forEach((e, k) => {
          const v = par[e.a] === k ? e.a : par[e.b] === k ? e.b : -1;
          e.color = null; e.dash = null; e.width = null;
          if (v >= 0) { e.color = "--setC"; e.width = fin[v] ? 4.5 : 3; e.dash = fin[v] ? null : [6, 5]; }
          if (onPath.has(k) && fin[tgt]) { e.color = "--setB"; e.width = 5.5; }
        });
        view.draw();
        // üzenet
        if (!rows.length) msg.innerHTML = `Kezdőcsúcs: <b>${ids[src]}</b> (címke 0), a többi ∞. Nyomd meg a „Lépés” gombot!`;
        else {
          const r = rows[rows.length - 1];
          const ups = G.edges.map((e, k) => (e.a === r.u || e.b === r.u ? (e.a === r.u ? e.b : e.a) : -1)).filter(v => v >= 0 && v !== src && r.cells[v] && r.cells[v] !== "–");
          msg.innerHTML = `${rows.length}. lépés: <b>${ids[r.u]}</b> véglegessé válik (${num(r.du)}).` +
            (ups.length ? ` Szomszédai: ${ups.map(v => ids[v] + " → " + r.cells[v]).join(" · ")}` : " Nincs nem végleges szomszédja.") +
            (done ? " <b>Kész:</b> minden elérhető csúcs végleges." : "");
        }
        if (tgt < 0) path.innerHTML = "Válassz célcsúcsot a listából: kiírom a legrövidebb utat.";
        else if (dist[tgt] === Infinity) path.innerHTML = done ? `${ids[tgt]} nem érhető el.` : `<b>${ids[tgt]}</b> címkéje még ∞.`;
        else {
          const { p, es } = pathTo(tgt);
          const sum = es.length > 1 ? es.map(k => num(len[k])).join(" + ") + " = " : "";
          path.innerHTML = fin[tgt]
            ? `Legrövidebb út: <b>${p.map(i => ids[i]).join(" → ")}</b>, hossza ${sum}<b>${num(dist[tgt])}</b>`
            : `<b>${ids[tgt]}</b> ideiglenes címkéje ${num(dist[tgt])} (${p.map(i => ids[i]).join(" → ")}) – még változhat, amíg nem végleges.`;
        }
        stat(stats, [["végleges csúcs", fin.filter(Boolean).length + " / " + ids.length], ["lépés", rows.length],
          [tgt >= 0 ? `${ids[tgt]} címkéje` : "célcsúcs", tgt >= 0 ? num(dist[tgt]) + (tgt >= 0 && fin[tgt] ? " ✓" : "") : "–"]]);
        const cols = ids.map((id, i) => i).filter(i => i !== src);
        tab.innerHTML = rows.length ? `<table><tr><th>lépés</th><th>véglegessé válik</th>${cols.map(i => `<th>${ids[i]}</th>`).join("")}</tr>` +
          rows.map((r, k) => `<tr><td>${k + 1}</td><td>${ids[r.u]} (${num(r.du)})</td>${cols.map(i => `<td>${r.cells[i]}</td>`).join("")}</tr>`).join("") + "</table>" : "";
      }
      build(true);
    };

    /* ------------------------------------------------------------------
       2.5  spanning-tree – Kruskal lépésenként
       ------------------------------------------------------------------ */
    W["spanning-tree"] = root => {
      header(root, "Kruskal-algoritmus: feszítőfa élről élre",
        "Az élek sorrendben jönnek (a településeknél hossz szerint növekvően, az Árvízhétnél erősség szerint csökkenően). Minden él bekerül, ha nem zár kört. Ha kört zárna, a kört pirossal mutatom.");
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      let ds = "town";
      toggleGroup(ctr, [["town", "Települések (minimális fa)"], ["arviz", "Árvízhét (maximális fa)"]], ds, v => { ds = v; seed = 0; build(); });
      const shuf = btn("🔀 másik sorrend az egyenlő súlyoknál", () => { seed++; build(true); });
      ctr.append(shuf);
      ctr2.append(btn("Lépés", () => { step(); paint(); }, "btn primary"), btn("Végig", () => { while (step()); paint(); }), btn("Újra", () => { reset(); paint(); }));
      const wrap = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem;align-items:flex-start" });
      const box = h("div", { style: "flex:1 1 340px;min-width:0" });
      const side = h("div", { style: "flex:0 1 230px;font-family:var(--mono);font-size:.9rem" });
      wrap.append(box, side);
      root.append(wrap);
      const msg = h("p", { class: "readout" }), stats = h("div", { class: "stat-row" });
      root.append(msg, stats);
      const view = new GK.View(box, { aspect: 0.6, radius: 17, showWeights: true, draggable: false });
      let G, order, status, uf, pos, cycle, lastPos, seed = 0;
      const trees = new Set();

      function build(shuffled) {
        G = ds === "town" ? townGraph(view.o.aspect) : lift(arvizGraph(view.o.aspect));
        shuf.style.display = ds === "arviz" ? "" : "none";
        const sgn = ds === "town" ? 1 : -1, R = GK.rng(seed * 7919 + 13), key = G.edges.map((_, i) => (shuffled ? R() : i));
        order = G.edges.map((_, i) => i).sort((x, y) => sgn * (G.edges[x].w - G.edges[y].w) || key[x] - key[y]);
        if (!shuffled) trees.clear();
        view.setGraph(G.nodes, G.edges);
        reset(); paint();
      }
      function reset() {
        status = order.map(() => 0); uf = G.ids.map((_, i) => i); pos = 0; cycle = null; lastPos = -1;
      }
      const find = x => (uf[x] === x ? x : (uf[x] = find(uf[x])));
      const taken = () => order.filter((_, p) => status[p] === 1);
      function treePath(a, b) {                                 // út a-ból b-be a bevett éleken (BFS)
        const T = taken(), prev = new Array(G.ids.length).fill(null), q = [a]; prev[a] = [-1, -1];
        while (q.length) {
          const u = q.shift();
          T.forEach(k => { const e = G.edges[k]; if (e.a !== u && e.b !== u) return; const v = e.a === u ? e.b : e.a; if (!prev[v]) { prev[v] = [u, k]; q.push(v); } });
        }
        const nodes = [b], es = [];
        let x = b; while (x !== a) { es.push(prev[x][1]); x = prev[x][0]; nodes.push(x); }
        return { nodes, es };
      }
      function step() {
        if (pos >= order.length) return false;
        const need = G.ids.length - 1;
        if (taken().length >= need) { for (let p = pos; p < order.length; p++) status[p] = 3; pos = order.length; return false; }
        const k = order[pos], e = G.edges[k];
        cycle = null; lastPos = pos;
        if (find(e.a) === find(e.b)) { status[pos] = 2; cycle = treePath(e.a, e.b); }
        else { uf[find(e.a)] = find(e.b); status[pos] = 1; }
        pos++;
        if (taken().length >= need) { for (let p = pos; p < order.length; p++) status[p] = 3; pos = order.length; }
        return true;
      }
      const ename = k => G.ids[G.edges[k].a] + "–" + G.ids[G.edges[k].b];
      function paint() {
        const T = taken(), total = T.reduce((s, k) => s + G.edges[k].w, 0), need = G.ids.length - 1, complete = T.length === need;
        view.hl.clear();
        view.edges.forEach((e, k) => {
          const p = order.indexOf(k), st = status[p];
          e.color = st === 1 ? "--setC" : null; e.width = st === 1 ? 5 : null; e.dash = st === 2 || st === 3 ? [4, 5] : null;
          if (cycle && cycle.es.includes(k)) e.color = "--bad";
          if (p === lastPos && st === 2) { e.color = "--bad"; e.width = 3; }
          if (p === lastPos && st === 1) e.color = "--accent";
        });
        if (cycle) cycle.nodes.forEach(i => view.hl.add(i));
        else if (lastPos >= 0 && status[lastPos] === 1) { const e = G.edges[order[lastPos]]; view.hl.add(e.a); view.hl.add(e.b); }
        view.draw();
        const mark = ["…", "✓", "✗ kört zárna", "– nem kell"], colr = ["var(--muted)", "var(--ok)", "var(--bad)", "var(--muted)"];
        side.innerHTML = `<div class="muted" style="margin-bottom:.3rem">rendezett éllista (${ds === "town" ? "növekvő" : "csökkenő"})</div>` +
          order.map((k, p) => `<div style="padding:.1rem .35rem;border-radius:6px;${p === lastPos ? "background:var(--accent-soft);font-weight:700;" : ""}color:${status[p] ? colr[status[p]] : "var(--text)"}">` +
            `${ename(k)} <b>${G.edges[k].w}</b> ${status[p] ? mark[status[p]] : '<span class="muted">…</span>'}</div>`).join("");
        if (lastPos < 0) msg.innerHTML = `Kezdetben egy él sincs bent: ${G.ids.length} különálló csúcs. Nyomd meg a „Lépés” gombot!`;
        else {
          const k = order[lastPos], st = status[lastPos];
          msg.innerHTML = st === 1 ? `<b>${ename(k)}</b> (${G.edges[k].w}) ✓ bevéve: két külön darabot köt össze.`
            : `<b>${ename(k)}</b> (${G.edges[k].w}) ✗ kört zárna: ${cycle.nodes.map(i => G.ids[i]).join(" – ")} – ${G.ids[cycle.nodes[0]]}. A kör többi éle már összeköti a végpontjait.`;
          if (complete) {
            trees.add(T.slice().sort((x, y) => x - y).join(","));
            msg.innerHTML += ` <b>Kész:</b> ${need} él = $n - 1$, a fa összsúlya <b>${total}</b>.` +
              (ds === "arviz" ? ` Eddig ${trees.size} különböző maximális fát láttál – mind ${total} súlyú. Próbáld a „másik sorrend” gombot!` : " A Hmv–Csg (37) kimaradt.");
          }
        }
        stat(stats, [["bevett él", T.length + " / " + need], ["összsúly", total], ["kihagyott (kört zárna)", status.filter(s => s === 2).length]]);
        math(msg);
      }
      build(false);
    };

    /* ------------------------------------------------------------------
       2.6  euler-trail – rajzold meg egy vonallal!
       ------------------------------------------------------------------ */
    W["euler-trail"] = root => {
      header(root, "Egy vonallal: Euler-vonal keresése",
        "Kattints egy kezdőcsúcsra, majd sorban a bejárandó élekre (vagy a szomszéd csúcsra). Minden él egyszer szerepelhet. A <b>narancs</b> csúcsok fokszáma páratlan; a szám a csúcs mellett a fokszám.");
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      let gname = "kon", broken = false;
      toggleGroup(ctr, [["kon", "Königsberg"], ["house", "Ház"], ["arviz", "Árvízhét"]], gname, v => { gname = v; build(); });
      const brk = h("input", { type: "checkbox", onchange: () => { broken = brk.checked; build(); } });
      const brkLab = h("label", null, brk, "egy É–Sz híd lebontása");
      ctr.append(brkLab);
      ctr2.append(btn("Visszavonás", () => { stopAnim(); undo(); paint(); }), btn("Újra", () => { stopAnim(); reset(); paint(); }),
        btn("Mutass egy megoldást", () => solve(), "btn primary"));
      const verdict = h("p", { class: "readout" });
      const box = h("div");
      root.append(verdict, box);
      const msg = h("p", { class: "readout" }), stats = h("div", { class: "stat-row" });
      root.append(msg, stats);
      const view = new GK.View(box, { aspect: 0.6, radius: 17, showWeights: true, draggable: false, edgeHitTol: 14,
        onNodeClick: i => { stopAnim(); clickNode(i); }, onEdgeClick: k => { stopAnim(); clickEdge(k); } });
      let G, seq, trail, used, timer = null, note = "";

      function graph() {
        const asp = view.o.aspect;
        if (gname === "arviz") return lift(arvizGraph(asp));
        const mk = (ids, pos, list, names) => {
          const P = GK.normalize(ids.map(i => pos[i]), asp);
          return lift({ ids, nodes: ids.map((id, i) => ({ label: id, x: P[i][0], y: P[i][1], sub: names ? names[id] : "" })),
            edges: list.map(([u, v]) => ({ a: ids.indexOf(u), b: ids.indexOf(v), w: 1 })) });
        };
        if (gname === "house") return mk(["A", "B", "C", "D", "E"], { A: [0, 2], B: [1, 2], C: [1, 1], D: [0, 1], E: [0.5, 0] },
          [["A", "B"], ["B", "C"], ["C", "D"], ["D", "A"], ["A", "C"], ["B", "D"], ["C", "E"], ["D", "E"]]);
        const br = [["É", "Sz"], ["É", "Sz"], ["D", "Sz"], ["D", "Sz"], ["K", "Sz"], ["É", "K"], ["D", "K"]];
        const g = mk(["É", "Sz", "D", "K"], { "É": [0, 0], Sz: [0, 1], D: [0, 2], K: [2, 1] }, broken ? br.slice(1) : br,
          { "É": "északi part", Sz: "sziget", D: "déli part", K: "keleti part" });
        g.bridge = (broken ? "bcdefg" : "abcdefg").split("");
        return g;
      }
      function build() {
        stopAnim();
        brkLab.style.display = gname === "kon" ? "" : "none";
        G = graph();
        view.setGraph(G.nodes, G.edges);
        reset(); paint();
      }
      function reset() { seq = []; trail = []; used = new Array(G.edges.length).fill(false); note = ""; }
      const n = () => G.ids.length, m = () => G.edges.length;
      const deg = () => GK.degrees(n(), G.edges.map(e => [e.a, e.b]));
      const odd = () => deg().map((d, i) => (d % 2 ? i : -1)).filter(i => i >= 0);
      const cur = () => (seq.length ? seq[seq.length - 1] : -1);
      const other = (k, u) => (G.edges[k].a === u ? G.edges[k].b : G.edges[k].a);
      const free = u => G.edges.map((e, k) => k).filter(k => !used[k] && (G.edges[k].a === u || G.edges[k].b === u));
      function go(k) { used[k] = true; trail.push(k); seq.push(other(k, cur())); note = ""; }
      function clickNode(i) {
        const c = cur();
        if (c < 0) { seq = [i]; note = ""; }
        else if (i === c && !trail.length) { seq = []; note = ""; }
        else {
          const ks = free(c).filter(k => other(k, c) === i);
          if (ks.length) go(ks[0]);
          else note = `⛔ ${G.ids[c]} és ${G.ids[i]} között nincs bejáratlan él.`;
        }
        paint();
      }
      function clickEdge(k) {
        const c = cur();
        if (c < 0) note = "Előbb kattints egy kezdőcsúcsra!";
        else if (used[k]) note = "⛔ Ezt az élt már bejártad – él nem ismétlődhet.";
        else if (G.edges[k].a !== c && G.edges[k].b !== c) note = `⛔ Ez az él nem a(z) ${G.ids[c]} csúcsból indul – a ceruzát nem emelheted fel.`;
        else go(k);
        paint();
      }
      function undo() {
        if (trail.length) { used[trail.pop()] = false; seq.pop(); }
        else seq = [];
        note = "";
      }
      function stopAnim() { if (timer) { clearInterval(timer); timer = null; } }
      /* Hierholzer-algoritmus: élindexek sorozata s-ből */
      function hierholzer(s) {
        const u2 = new Array(m()).fill(false), st = [[s, -1]], out = [];
        while (st.length) {
          const [v, e] = st[st.length - 1];
          const k = G.edges.findIndex((f, j) => !u2[j] && (f.a === v || f.b === v));
          if (k >= 0) { u2[k] = true; st.push([other(k, v), k]); }
          else { st.pop(); if (e >= 0) out.push(e); }
        }
        return out.reverse();
      }
      function solve() {
        stopAnim();
        const o = odd();
        if (o.length !== 0 && o.length !== 2) { note = `Nincs megoldás: ${o.length} páratlan fokú csúcs van, legfeljebb 2 lehetne.`; paint(); return; }
        const s = o.length === 2 ? (o.includes(seq[0]) ? seq[0] : o[0]) : (seq.length ? seq[0] : 0);
        const path = hierholzer(s);
        reset(); seq = [s]; paint();
        let i = 0;
        timer = setInterval(() => {
          if (i >= path.length) { stopAnim(); return; }
          go(path[i++]); paint();
          if (i >= path.length) stopAnim();
        }, 420);
      }
      function paint() {
        const d = deg(), o = odd(), c = cur(), fr = c >= 0 ? new Set(free(c)) : new Set();
        view.nodes.forEach((nd, i) => { nd.badge = d[i]; nd.color = d[i] % 2 ? "--setB" : null; });
        view.hl.clear(); if (c >= 0) view.hl.add(c);
        view.sel = seq.length ? seq[0] : -1;
        view.edges.forEach((e, k) => {
          const step = trail.indexOf(k);
          e.color = step >= 0 ? "--accent" : fr.has(k) ? "--setC" : null;
          e.width = step >= 0 ? 4.5 : fr.has(k) ? 3 : 2;
          e.dash = step < 0 && fr.has(k) ? [6, 4] : null;
          e.label = step >= 0 ? String(step + 1) : (G.bridge ? G.bridge[k] : "");
        });
        view.draw();
        const conn = componentsOf(n(), G.edges.map(e => [e.a, e.b])).count === 1;
        const oddTxt = o.length ? o.map(i => G.ids[i]).join(", ") : "nincs";
        verdict.innerHTML = `Páratlan fokú csúcsok: <b>${oddTxt}</b> (${o.length} db). ` + (!conn ? "A gráf nem összefüggő → <b>nincs</b> Euler-vonal."
          : o.length === 0 ? "→ <b>zárt</b> Euler-vonal van, bármelyik csúcsból indulhatsz, és oda érsz vissza."
          : o.length === 2 ? `→ <b>nyitott</b> Euler-vonal van: az egyik páratlan fokú csúcsból (${oddTxt}) indul, a másikban ér véget.`
          : `→ <b>nincs</b> Euler-vonal: legfeljebb 2 csúcs lehet kezdő- vagy végpont.`);
        let t;
        if (note) t = note;
        else if (c < 0) t = "Kattints egy kezdőcsúcsra!";
        else if (trail.length === m()) t = `🎉 Kész! Mind a ${m()} élt bejártad: ${seq.map(i => G.ids[i]).join(" – ")}` + (seq[0] === c ? " (zárt vonal)." : " (nyitott vonal).");
        else if (!fr.size && trail.length) t = `Elakadtál: ${G.ids[c]}-ből nem vezet több bejáratlan él, pedig ${m() - trail.length} él maradt. Vonj vissza!`;
        else t = `Itt tartasz: ${G.ids[c]}. A szaggatott zöld élek közül választhatsz.` +
          (!trail.length && o.length === 2 && !o.includes(c) ? ` <span style="color:var(--bad)">Páros fokú csúcsból indultál – így nem fog sikerülni.</span>` : "");
        msg.innerHTML = t + (seq.length > 1 && trail.length < m() ? `<br><span class="muted">út: ${seq.map(i => G.ids[i]).join(" – ")}</span>` : "");
        stat(stats, [["bejárt él", trail.length + " / " + m()], ["páratlan fokú", o.length], ["kezdőcsúcs", seq.length ? G.ids[seq[0]] : "–"]]);
      }
      build();
    };

    /* ------------------------------------------------------------------
       2.7  walk-counter – séták száma = A^k elemei
       ------------------------------------------------------------------ */
    W["walk-counter"] = root => {
      header(root, "Séták számlálása mátrixhatvánnyal",
        "Állítsd be $k$-t, és kattints a mátrix egy cellájára (vagy két csúcsra)! Kiírom a $k$ hosszú sétákat. A <span style=\"outline:2px solid var(--setB);padding:0 .2em\">keretes</span> cellák ennél a $k$-nál lettek először pozitívak.");
      const ctr = h("div", { class: "controls" });
      root.append(ctr);
      let ds = "friend", k = 2, si = 0, sj = 3, pick = 0, walkHL = -1, G, A;
      toggleGroup(ctr, [["friend", "Barátsággráf"], ["arviz", "Árvízhét"]], ds, v => { ds = v; build(); });
      const kv = h("b", null, String(k));
      const sl = h("input", { type: "range", min: 1, max: 4, step: 1, value: k, oninput: () => { k = +sl.value; kv.textContent = k; walkHL = -1; paint(); } });
      ctr.append(h("label", null, "$k$ = ", kv, sl));
      const wrap = h("div", { style: "display:flex;flex-wrap:wrap;gap:.8rem;align-items:flex-start" });
      const box = h("div", { style: "flex:1 1 320px;min-width:0" });
      const tab = h("div", { style: "flex:0 1 auto;overflow-x:auto" });
      wrap.append(box, tab);
      root.append(wrap);
      const out = h("div", { class: "readout" }), note = h("div", { class: "readout" });
      root.append(out, note);
      const view = new GK.View(box, { aspect: 0.55, radius: 17, draggable: false,
        onNodeClick: i => { if (pick === 0) { si = i; sj = -1; pick = 1; } else { sj = i; pick = 0; } walkHL = -1; paint(); } });
      tab.addEventListener("click", ev => {
        const td = ev.target.closest("td[data-i]");
        if (!td) return;
        si = +td.dataset.i; sj = +td.dataset.j; pick = 0; walkHL = -1; paint();
      });
      out.addEventListener("click", ev => {
        const li = ev.target.closest("[data-w]");
        if (!li) return;
        walkHL = walkHL === +li.dataset.w ? -1 : +li.dataset.w; paint();
      });

      const mul = (X, Y) => X.map((r, i) => Y[0].map((_, j) => r.reduce((s, x, l) => s + x * Y[l][j], 0)));
      const pow = p => { let P = A; for (let t = 1; t < p; t++) P = mul(P, A); return P; };
      function build() {
        if (ds === "friend") {
          const ids = ["A", "B", "C", "D"], P = GK.normalize([[0, 0], [0, 1], [1, 0.5], [2.1, 0.5]], view.o.aspect);
          G = { ids, nodes: ids.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges: [[0, 1], [0, 2], [1, 2], [2, 3]].map(([a, b]) => ({ a, b, w: 1 })) };
          si = 0; sj = 3;
        } else { G = lift(arvizGraph(view.o.aspect)); G.edges = G.edges.map(e => ({ a: e.a, b: e.b, w: 1 })); si = G.ids.indexOf("Kl"); sj = G.ids.indexOf("La"); }
        A = GK.adjMatrix(G.ids.length, G.edges.map(e => [e.a, e.b]));
        view.setGraph(G.nodes, G.edges);
        pick = 0; walkHL = -1; paint();
      }
      function walks(i, j, len) {
        const res = [], L = GK.adjList(G.ids.length, G.edges.map(e => [e.a, e.b])), w = [i];
        (function rec() {
          if (res.length > 40) return;
          if (w.length === len + 1) { if (w[len] === j) res.push(w.slice()); return; }
          L[w[w.length - 1]].forEach(v => { w.push(v); rec(); w.pop(); });
        })();
        return res;
      }
      function firstK(i, j) { for (let t = 1; t <= G.ids.length; t++) if (pow(t)[i][j] > 0) return t; return Infinity; }
      function paint() {
        const ids = G.ids, nn = ids.length, Ak = pow(k), prev = Array.from({ length: nn }, () => new Array(nn).fill(0));
        for (let t = 1; t < k; t++) { const P = pow(t); P.forEach((r, i) => r.forEach((v, j) => (prev[i][j] += v))); }
        const fresh = (i, j) => i !== j && Ak[i][j] > 0 && prev[i][j] === 0;
        tab.innerHTML = `<table class="adj"><tr><th>$A^{${k}}$</th>${ids.map((l, j) => `<th${j === sj ? ' class="hl"' : ""}>${l}</th>`).join("")}</tr>` +
          Ak.map((r, i) => `<tr><th${i === si ? ' class="hl"' : ""}>${ids[i]}</th>${r.map((v, j) =>
            `<td data-i="${i}" data-j="${j}" class="${v ? "one" : ""}${i === si && j === sj ? " hl" : ""}" style="cursor:pointer;${fresh(i, j) ? "box-shadow:inset 0 0 0 2px var(--setB);" : ""}${i === j ? "font-style:italic;" : ""}">${v}</td>`).join("")}</tr>`).join("") + "</table>";
        // gráf
        view.hl.clear(); view.hlE.clear(); view.dim = false;
        if (si >= 0) view.hl.add(si);
        if (sj >= 0) view.hl.add(sj);
        view.nodes.forEach((nd, i) => { nd.color = i === si ? "--accent" : i === sj ? "--setB" : null; });
        let html;
        if (si < 0 || sj < 0) html = `Kiindulópont: <b>${ids[si]}</b>. Kattints a célcsúcsra!`;
        else {
          const v = Ak[si][sj];
          html = `$(A^{${k}})_{${ids[si]}${ids[sj]}} = ${v}$: ennyi ${k} hosszú séta vezet ${ids[si]}-ből ${ids[sj]}-be.`;
          if (v > 0 && v <= 40) {
            const W8 = walks(si, sj, k);
            html += `<div style="display:flex;flex-wrap:wrap;gap:.3rem .5rem;margin-top:.35rem">` +
              W8.map((w, t) => `<span data-w="${t}" class="btn${t === walkHL ? " on" : ""}" style="padding:.1rem .45rem;font-size:.85rem">${w.map(x => ids[x]).join(", ")}</span>`).join("") + "</div>";
            if (walkHL >= 0 && W8[walkHL]) { const w = W8[walkHL]; view.dim = true; for (let t = 0; t < w.length - 1; t++) view.hlE.add(GK.edgeKey(w[t], w[t + 1])); w.forEach(x => view.hl.add(x)); }
          } else if (v > 40) html += " (Túl sok a felsoroláshoz.)";
          const f = firstK(si, sj);
          if (si !== sj) html += `<br>Először $k = ${f === Infinity ? "\\infty" : f}$-nél pozitív → <b>távolság</b> $d(${ids[si]}, ${ids[sj]}) = ${f === Infinity ? "\\infty" : f}$` +
            (f !== Infinity ? (k < f ? ` (most $k = ${k} < ${f}$, ezért 0).` : ".") : ".");
          else html += `<br>Főátló: zárt séták ${ids[si]}-ből vissza ${ids[si]}-be.`;
        }
        out.innerHTML = html;
        view.draw();
        const diag = Ak.map((r, i) => r[i]), tr = diag.reduce((a, b) => a + b, 0);
        note.innerHTML = k === 1 ? "A főátló csupa 0: hurok nincs, 1 hosszú zárt séta nincs."
          : k === 2 ? `Főátló $= ${diag.join(", ")}$ – éppen a fokszámok: a 2 hosszú zárt séta oda-vissza egy élen.`
          : k === 3 ? `Főátló $= ${diag.join(", ")}$: $(A^3)_{ii}$ az $i$-t tartalmazó háromszögek számának <b>kétszerese</b> (két irány). $\\operatorname{tr}(A^3) = ${tr}$, így a háromszögek száma $${tr}/6 = ${tr / 6}$ (minden háromszöget 3 csúcsnál, 2 irányban számoltunk: $3 \\cdot 2 = 3!$).`
          : `$\\operatorname{tr}(A^4) = ${tr}$ – a 4 hosszú zárt séták száma (a 4-körök mellett az oda-vissza séták is benne vannak).`;
        math(out); math(note); math(tab);
      }
      build();
      math(ctr); math(root.querySelector(".w-sub"));
    };
  }
  /* ------------------------------------------------------------------
     Indítás
     ------------------------------------------------------------------ */
  document.querySelectorAll(".widget[data-widget]").forEach(root => {
    const f = W[root.dataset.widget];
    if (!f) return;
    try { f(root); }
    catch (e) { root.append(h("p", { class: "muted" }, "Hiba a szemléltetés betöltésekor: " + e.message)); console.error(e); }
  });
})();
