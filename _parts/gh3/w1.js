
  /* ------------------------------------------------------------------
     3.1  directed-explorer – befok, kifok, elérhetőség, erős komponensek
     ------------------------------------------------------------------ */
  const PAPER_IDS = D.papers.map(p => p.id);
  const artPaper = id => D.articles.find(a => a.id === id).paper;
  function paperCitations() {                       // lapszintű, súlyozott hivatkozások (saját lapon belül nélkül)
    const m = {};
    D.citations.forEach(([a, b]) => { const pa = artPaper(a), pb = artPaper(b); if (pa !== pb) { const k = pa + ">" + pb; m[k] = (m[k] || 0) + 1; } });
    return Object.entries(m).map(([k, w]) => { const [u, v] = k.split(">"); return { a: PAPER_IDS.indexOf(u), b: PAPER_IDS.indexOf(v), w }; });
  }
  function reachDir(n, edges, s, rev = false) {
    const L = Array.from({ length: n }, () => []);
    edges.forEach(e => (rev ? L[e.b].push(e.a) : L[e.a].push(e.b)));
    const seen = new Set([s]), st = [s];
    while (st.length) { const u = st.pop(); L[u].forEach(v => { if (!seen.has(v)) { seen.add(v); st.push(v); } }); }
    return seen;
  }
  function sccs(n, edges) {                         // egyszerű: kölcsönös elérhetőség
    const fw = [...Array(n).keys()].map(s => reachDir(n, edges, s));
    const comp = new Array(n).fill(-1); let c = 0;
    for (let i = 0; i < n; i++) if (comp[i] < 0) { for (let j = 0; j < n; j++) if (fw[i].has(j) && fw[j].has(i)) comp[j] = c; c++; }
    return { comp, count: c };
  }

  W["directed-explorer"] = root => {
    header(root, "Irányított gráf: befok, kifok, elérhetőség",
      "Kattints egy csúcsra: kékkel látod, kiket ér el a nyilak mentén, narancssárgával, kik érik el őt. Az „Él be/ki” módban két csúcsra kattintva irányított élt adsz hozzá vagy törölsz. A csúcs melletti szám: kifok / befok.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    let data = "papers", mode = "reach", focus = -1, sel = -1, showScc = false, undirected = false;
    toggleGroup(ctr, [["small", "kis példa"], ["papers", "lapok hivatkozásai"], ["articles", "cikkek hivatkozásai"]], data, v => { data = v; load(); });
    const ctr2 = h("div", { class: "controls" });
    root.append(ctr2);
    toggleGroup(ctr2, [["reach", "Elérhetőség"], ["edit", "Él be/ki"]], mode, v => { mode = v; sel = -1; paint(); });
    const sccCb = h("input", { type: "checkbox", onchange: () => { showScc = sccCb.checked; paint(); } });
    const undCb = h("input", { type: "checkbox", onchange: () => { undirected = undCb.checked; paint(); } });
    ctr2.append(h("label", null, sccCb, " erős komponensek színnel"), h("label", null, undCb, " irány elhagyása"), btn("Visszaállítás", () => load()));
    const box = h("div");
    root.append(box);
    const read = h("div", { class: "readout" });
    const tbl = h("div", { class: "tw", style: "overflow-x:auto" });
    root.append(read, tbl);
    let nodes = [], edges = [];
    const view = new GK.View(box, { aspect: 0.5, radius: 16, directed: true, showWeights: false, onNodeClick: i => {
      if (mode === "reach") { focus = focus === i ? -1 : i; paint(); return; }
      if (sel < 0) { sel = i; paint(); return; }
      if (sel !== i) {
        const k = edges.findIndex(e => e.a === sel && e.b === i);
        if (k >= 0) edges.splice(k, 1); else edges.push({ a: sel, b: i, w: 1 });
      }
      sel = -1; paint();
    } });
    function load() {
      focus = -1; sel = -1;
      if (data === "small") {
        const P = GK.normalize([[0, 0], [1, 0], [0.5, 0.9], [1.6, 0.9]], 0.5);
        nodes = ["A", "B", "C", "D"].map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] }));
        edges = [[0, 1], [1, 2], [2, 0], [2, 3]].map(([a, b]) => ({ a, b, w: 1 }));
      } else if (data === "papers") {
        const P = GK.normalize([[0, 0], [1.4, 0], [1.4, 1.1], [0, 1.1]], 0.5);
        nodes = D.papers.map((p, i) => ({ label: p.id, x: P[i][0], y: P[i][1], color: p.color, sub: p.name }));
        edges = paperCitations();
      } else {                                         // cikkek: x = nap, y = lap
        const raw = D.articles.map(a => [D.days.indexOf(a.day), PAPER_IDS.indexOf(a.paper) + (a.id === 6 ? 0.35 : 0)]);
        const P = GK.normalize(raw, 0.5);
        nodes = D.articles.map((a, i) => ({ label: String(a.id), x: P[i][0], y: P[i][1], color: paper(a.paper).color, sub: D.dayNames[a.day].slice(0, 3) + "." }));
        edges = D.citations.map(([a, b]) => ({ a: a - 1, b: b - 1, w: 1 }));
      }
      paint();
    }
    function paint() {
      const n = nodes.length;
      const outd = new Array(n).fill(0), ind = new Array(n).fill(0);
      edges.forEach(e => { outd[e.a] += e.w; ind[e.b] += e.w; });
      const S = sccs(n, edges);
      const fw = focus >= 0 ? reachDir(n, edges, focus) : null, bw = focus >= 0 ? reachDir(n, edges, focus, true) : null;
      const base = data === "papers" ? null : undefined;
      const ns = nodes.map((nd, i) => {
        let color = nd.color;
        if (showScc) color = COMP_COLORS[S.comp[i] % COMP_COLORS.length];
        if (fw) color = i === focus ? "--accent" : fw.has(i) && bw.has(i) ? "#14b8a6" : fw.has(i) ? "--setA" : bw.has(i) ? "--setB" : null;
        return { ...nd, color, badge: undirected ? (outd[i] + ind[i]) : `${outd[i]}/${ind[i]}` };
      });
      view.o.directed = !undirected;
      view.o.showWeights = data === "papers";
      view.setGraph(ns, edges.map(e => ({ ...e, label: data === "papers" ? e.w : undefined })));
      view.sel = sel; view.hl.clear(); view.dim = false;
      view.draw();
      const m = edges.reduce((s, e) => s + e.w, 0);
      let txt = undirected ? `Irány nélkül: a csúcs melletti szám a (súlyozott) fokszám. A befok és a kifok különbsége eltűnt.`
        : `$m = ${m}$ (súlyozva); $\\sum d^+ = ${outd.reduce((a, b) => a + b, 0)}$, $\\sum d^- = ${ind.reduce((a, b) => a + b, 0)}$. Erős komponensek: <b>${S.count}</b>` +
          (S.count === 1 ? " – erősen összefüggő!" : "") + ".";
      if (fw && !undirected) txt += `<br><b>${nodes[focus].label}</b>-ból elérhető: ${[...fw].filter(i => i !== focus).map(i => nodes[i].label).join(", ") || "senki"} · ` +
        `<b>${nodes[focus].label}</b>-t elérik: ${[...bw].filter(i => i !== focus).map(i => nodes[i].label).join(", ") || "senki"}.`;
      if (mode === "edit") txt += `<br>Él be/ki mód: ${sel >= 0 ? `kiinduló csúcs <b>${nodes[sel].label}</b> – most kattints az érkező csúcsra.` : "kattints a kiinduló csúcsra."}`;
      read.innerHTML = txt;
      if (n <= 6) {
        const M = nodes.map(() => new Array(n).fill(0)); edges.forEach(e => (M[e.a][e.b] += e.w));
        tbl.innerHTML = `<table class="adj"><tr><th>honnan \\ hová</th>${nodes.map(x => `<th>${x.label}</th>`).join("")}<th>kifok</th></tr>` +
          M.map((r, i) => `<tr><th>${nodes[i].label}</th>${r.map(v => `<td class="${v ? "one" : ""}">${v}</td>`).join("")}<td>${outd[i]}</td></tr>`).join("") +
          `<tr><th>befok</th>${ind.map(v => `<td>${v}</td>`).join("")}<td></td></tr></table>`;
      } else tbl.innerHTML = "<p class='muted'>A cikkek hivatkozási gráfjában a vízszintes tengely a nap (hétfő → vasárnap), a sorok a lapok. Minden nyíl balra vagy függőlegesen mutat: korábbi (vagy aznapi) cikkre. Ezért nincs irányított kör: DAG.</p>";
      math(read);
    }
    load();
  };

  /* ------------------------------------------------------------------
     3.4  bipartite-projection – páros gráf és vetülete
     ------------------------------------------------------------------ */
  W["bipartite-projection"] = root => {
    header(root, "Páros gráf és vetülete: lapok és események",
      "A táblázat celláira kattintva be- és kikapcsolod, hogy a lap írt-e az eseményről. Jobb oldalt élőben látod a vetületet. Válassz súlyozást, és nézd meg, hogyan változik a „leghasonlóbb” pár!");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    let side = "papers", wmode = "count";
    toggleGroup(ctr, [["papers", "lapvetület"], ["events", "eseményvetület"]], side, v => { side = v; paint(); });
    const ctr2 = h("div", { class: "controls" });
    root.append(ctr2);
    toggleGroup(ctr2, [["count", "darab"], ["jaccard", "Jaccard"], ["newman", "Newman"]], wmode, v => { wmode = v; paint(); });
    ctr2.append(btn("Eredeti adat", () => { init(); paint(); }));
    const row = h("div", { class: "two-col" });
    const lb = h("div"), rb = h("div");
    row.append(lb, rb);
    root.append(row);
    const tbl = h("div", { class: "tw", style: "overflow-x:auto" });
    const read = h("div", { class: "readout" });
    root.append(tbl, read);
    const EV = D.events.map(e => e.id);
    let B;
    function init() { B = PAPER_IDS.map(p => EV.map(e => (D.events.find(x => x.id === e).articles.some(a => artPaper(a) === p) ? 1 : 0))); }
    init();
    const BV = new GK.View(lb, { aspect: 0.95, maxW: 380, radius: 15 });
    const PV = new GK.View(rb, { aspect: 0.95, maxW: 380, radius: 16, showWeights: true });
    function paint() {
      // páros gráf
      const nodes = PAPER_IDS.map((p, i) => ({ label: p, x: 0.16, y: 0.12 + 0.76 * i / 3, color: paper(p).color }))
        .concat(EV.map((e, j) => ({ label: e, x: 0.84, y: 0.07 + 0.86 * j / 5 })));
      const be = [];
      B.forEach((r, i) => r.forEach((v, j) => { if (v) be.push({ a: i, b: 4 + j }); }));
      BV.setGraph(nodes, be);
      // vetület
      const rows = side === "papers" ? B : EV.map((_, j) => B.map(r => r[j]));
      const labs = side === "papers" ? PAPER_IDS : EV, other = side === "papers" ? B.map((_, i) => i) : null;
      const colSize = side === "papers" ? EV.map((_, j) => B.reduce((s, r) => s + r[j], 0)) : PAPER_IDS.map((_, i) => B[i].reduce((s, v) => s + v, 0));
      const n = labs.length, pe = [];
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) {
        let common = 0, uni = 0, nw = 0;
        rows[i].forEach((v, k) => { if (v && rows[j][k]) { common++; nw += colSize[k] > 1 ? 1 / (colSize[k] - 1) : 0; } if (v || rows[j][k]) uni++; });
        if (!common) continue;
        const w = wmode === "count" ? common : wmode === "jaccard" ? common / uni : nw;
        pe.push({ a: i, b: j, w, label: fmt(w, 2) });
      }
      const P = side === "papers" ? GK.normalize([[0, 0], [1.4, 0], [1.4, 1.1], [0, 1.1]], 0.95) : GK.circleLayout(n).map(p => [p[0], p[1]]);
      PV.setGraph(labs.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1], color: side === "papers" ? paper(l).color : null })), pe);
      const mx = pe.reduce((m, e) => Math.max(m, e.w), 0), top = pe.filter(e => Math.abs(e.w - mx) < 1e-9);
      pe.forEach(e => (e.width = 1.5 + 4 * e.w / (mx || 1)));
      PV.edges = pe.map(e => ({ ...e }));
      PV.draw();
      // táblázat B
      tbl.innerHTML = "";
      const t = h("table", { class: "adj" });
      t.append(h("tr", null, h("th", null, "B"), EV.map(e => h("th", { title: D.events.find(x => x.id === e).title }, e)), h("th", null, "Σ")));
      B.forEach((r, i) => t.append(h("tr", null, h("th", null, PAPER_IDS[i]),
        r.map((v, j) => h("td", { class: v ? "one" : "", style: "cursor:pointer", onclick: () => { B[i][j] = 1 - B[i][j]; paint(); } }, String(v))),
        h("td", null, String(r.reduce((s, v) => s + v, 0))))));
      t.append(h("tr", null, h("th", null, "Σ"), EV.map((_, j) => h("td", null, String(B.reduce((s, r) => s + r[j], 0)))), h("td")));
      tbl.append(t);
      const lost = side === "papers" ? EV.filter((_, j) => colSize[j] === 1) : [];
      read.innerHTML = (top.length ? `Legerősebb kapcsolat (${{ count: "darab", jaccard: "Jaccard", newman: "Newman" }[wmode]}): <b>${top.map(e => labs[e.a] + "–" + labs[e.b]).join(", ")}</b> (${fmt(mx, 2)}). ` : "Nincs él a vetületben. ") +
        `A vetületnek ${pe.length} éle van.` +
        (lost.length ? ` <br>A lapvetületből <b>kimarad</b>: ${lost.map(e => `${e} (${D.events.find(x => x.id === e).title})`).join(", ")} – erről csak egy lap írt.` : "");
    }
    paint();
  };

  /* ------------------------------------------------------------------
     3.5  temporal-paths – időbeli gráf, időben érvényes utak
     ------------------------------------------------------------------ */
  W["temporal-paths"] = root => {
    header(root, "Időbeli gráf: ki érhető el időben érvényes úton?",
      "Kattints egy szereplőre (kezdőpont), majd lépkedj a napokon! Színes az a csúcs, amelyet a kezdőpontból addig a napig időben érvényes úton (csak előre haladva az időben) elérünk; a szám az érkezés napja. A halvány élek a korábbi napokéi.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    let day = 0, start = D.actors.findIndex(a => a.id === "Kl"), view_ = "cum", timer = 0;
    const dayLab = h("b");
    const sl = h("input", { type: "range", min: 0, max: 6, step: 1, value: 0, oninput: () => { day = +sl.value; paint(); } });
    ctr.append(h("label", null, "nap: ", dayLab, " ", sl), btn("◀", () => { if (day > 0) { day--; sl.value = day; paint(); } }), btn("▶", () => { if (day < 6) { day++; sl.value = day; paint(); } }),
      btn("Lejátszás", () => { clearInterval(timer); day = 0; sl.value = 0; paint(); timer = setInterval(() => { if (day >= 6) { clearInterval(timer); return; } day++; sl.value = day; paint(); }, 900); }));
    const ctr2 = h("div", { class: "controls" });
    root.append(ctr2);
    toggleGroup(ctr2, [["snap", "csak az aznapi élek"], ["cum", "eddig összevonva"]], view_, v => { view_ = v; paint(); });
    const box = h("div");
    root.append(box);
    const read = h("div", { class: "readout" });
    root.append(read);
    const ids = D.actors.map(a => a.id), pos = actorPositions(0.5);
    const TE = [];                                   // időbeli élek: [a, b, nap, cikk]
    D.articles.forEach(a => { const m = a.mentions; for (let i = 0; i < m.length; i++) for (let j = i + 1; j < m.length; j++) TE.push([ids.indexOf(m[i]), ids.indexOf(m[j]), D.days.indexOf(a.day), a.id]); });
    const staticE = cooc(D.articles);
    const sEdges = Object.keys(staticE).map(k => { const [u, v] = k.split("|"); return [ids.indexOf(u), ids.indexOf(v)]; });
    const view = new GK.View(box, { aspect: 0.5, radius: 17, onNodeClick: i => { start = i; paint(); } });
    function arrival(s, upTo) {                      // a legkorábbi érkezés napja (nem csökkenő időbélyegek), hány lépésben
      const best = new Array(ids.length).fill(Infinity), hops = new Array(ids.length).fill(Infinity), par = new Array(ids.length).fill(null);
      best[s] = -1; hops[s] = 0;
      for (let pass = 0; pass < 20; pass++) {
        let ch = false;
        TE.forEach(([a, b, t, art]) => {
          if (t > upTo) return;
          [[a, b], [b, a]].forEach(([x, y]) => {
            if (best[x] <= t && (t < best[y] || (t === best[y] && hops[x] + 1 < hops[y]))) { best[y] = t; hops[y] = hops[x] + 1; par[y] = [x, t, art]; ch = true; }
          });
        });
        if (!ch) break;
      }
      return { best, hops, par };
    }
    function paint() {
      dayLab.textContent = D.dayNames[D.days[day]];
      const R = arrival(start, day), Rall = arrival(start, 6);
      const sd = bfsDist(ids.length, sEdges, start);
      const edges = [];
      TE.forEach(([a, b, t]) => {
        if (t > day) return;
        if (view_ === "snap" && t !== day) return;
        if (edges.some(e => GK.edgeKey(e.a, e.b) === GK.edgeKey(a, b))) { const e = edges.find(e => GK.edgeKey(e.a, e.b) === GK.edgeKey(a, b)); if (t === day) { e.color = "--accent"; e.width = 3; e.dash = null; } return; }
        edges.push(t === day ? { a, b, color: "--accent", width: 3 } : { a, b, color: "--border", width: 2, dash: [4, 4] });
      });
      view.setGraph(ids.map((id, i) => ({ label: id, x: pos[id][0], y: pos[id][1], sub: actorName(id),
        color: i === start ? "--accent" : R.best[i] !== Infinity ? "--setC" : null,
        badge: i === start ? "start" : R.best[i] !== Infinity ? D.days[R.best[i]] : null })), edges);
      // az időben érvényes utak fája
      view.hlE.clear();
      ids.forEach((_, v) => { if (R.par[v]) view.hlE.add(GK.edgeKey(R.par[v][0], v)); });
      view.draw();
      const rows = ids.map((id, i) => i === start ? null : `<tr><td>${actorName(id)}</td><td>${sd[i] === Infinity ? "∞" : sd[i]}</td><td>${Rall.best[i] === Infinity ? "<b>nem érhető el</b>" : D.dayNames[D.days[Rall.best[i]]] + ", " + Rall.hops[i] + " lépés"}</td></tr>`).filter(Boolean);
      read.innerHTML = `Kezdőpont: <b>${actorName(ids[start])}</b> (a hét elejétől). ${D.dayNames[D.days[day]]} végéig elérve: <b>${R.best.filter((b, i) => b !== Infinity && i !== start).length}</b> szereplő.` +
        `<table style="margin-top:.4rem"><tr><th>szereplő</th><th>távolság az összevont gráfban</th><th>időben érvényes úton (a hét végéig)</th></tr>${rows.join("")}</table>`;
    }
    paint();
  };
