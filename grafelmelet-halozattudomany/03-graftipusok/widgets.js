/* =========================================================
   Gráfelmélet és hálózattudomány 3. fejezet – interaktív szemléltetések
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
  /* ==================================================================
     w2: 3.3, 3.6, 3.7, 3.8 widgetjei (signed-view, multilayer-view, kg-explorer, graph-type-chooser)
     A saját segédfüggvények blokkban, hogy ne ütközzenek a w1 neveivel.
     ================================================================== */
  {
    const art = id => D.articles.find(a => a.id === id);
    const paperName = id => paper(id).name;
    /* a csúcsok alatti név (sub) ne lógjon le a vászonról */
    const liftY = y => 0.07 + (y - 0.08) * 0.9;
    const statRow = (parent, list) => {
      parent.innerHTML = "";
      list.forEach(([l, v]) => parent.append(h("div", { class: "stat" }, h("div", { class: "v" }, String(v)), h("div", { class: "l" }, l))));
    };
    const MINUS = "−";
    const sgnTxt = s => (s > 0 ? "+" : MINUS);

    /* ------------------------------------------------------------------
       3.3  signed-view – az Árvízhét előjeles gráfja
       ------------------------------------------------------------------ */
    W["signed-view"] = root => {
      header(root, "Előjeles gráf: támogatás és bírálat",
        "A <b style=\"color:var(--ok)\">zöld</b> él támogató, a <b style=\"color:var(--bad)\">piros szaggatott</b> bíráló kijelentés. Kattints egy élre: megmutatom a forráscikket. " +
        "„Mi lenne, ha…” módban az élre kattintás megfordítja az előjelet – figyeld a háromszögeket!");
      const ctr = h("div", { class: "controls" });
      root.append(ctr);
      let mode = "src";
      toggleGroup(ctr, [["src", "Forrás megtekintése"], ["flip", "Mi lenne, ha… (előjelváltás)"]], mode, v => { mode = v; paint(); });
      ctr.append(btn("Visszaállítás", () => { reset(); paint(); }));
      const box = h("div");
      root.append(box);
      const ids = D.actors.map(a => a.id), n = ids.length;
      const narrow = root.clientWidth < 560, aspect = narrow ? 0.85 : 0.58;     // keskeny képernyőn magasabb vászon
      const pos = actorPositions(aspect);
      const nodes = ids.map(id => ({ label: id, x: pos[id][0], y: liftY(pos[id][1]), sub: actorName(id) }));
      const base = D.relations.map(r => ({ a: ids.indexOf(r.a), b: ids.indexOf(r.b), sign: r.sign, article: r.article, text: r.text, ra: r.a, rb: r.b }));
      let signs = base.map(r => r.sign), selEdge = -1, selTri = -1;
      const view = new GK.View(box, { aspect, radius: narrow ? 15 : 17, showWeights: true, draggable: false, nodes, edges: [],
        onEdgeClick: i => {
          if (mode === "flip") signs[i] = -signs[i];
          selEdge = i; paint();
        },
        onNodeClick: () => { selEdge = -1; selTri = -1; paint(); } });
      const info = h("div", { class: "readout" });
      const triBox = h("div", { class: "controls" });
      const triMsg = h("div", { class: "readout" });
      const stats = h("div", { class: "stat-row" });
      const tab = h("div", { style: "overflow-x:auto;margin-top:.6rem" });
      root.append(info, h("p", { style: "margin:.7rem 0 0;font-weight:600" }, "Háromszögek (kattints rájuk):"), triBox, triMsg, stats, tab);

      /* háromszögek: a szerkezet nem változik, csak az előjelek */
      const ek = {};
      base.forEach((r, i) => (ek[GK.edgeKey(r.a, r.b)] = i));
      const tris = [];
      for (let x = 0; x < n; x++) for (let y = x + 1; y < n; y++) for (let z = y + 1; z < n; z++) {
        const e1 = ek[GK.edgeKey(x, y)], e2 = ek[GK.edgeKey(y, z)], e3 = ek[GK.edgeKey(x, z)];
        if (e1 != null && e2 != null && e3 != null) tris.push({ v: [x, y, z], e: [e1, e2, e3] });
      }
      /* a szöveg sorrendje: Ko–Vi–Po, Ko–Vi–Sz, Po–La–Ön */
      const ORDER = ["Ko", "Vi", "Po", "La", "Ön", "Sz", "Kl"];
      tris.forEach(t => t.v.sort((p, q) => ORDER.indexOf(ids[p]) - ORDER.indexOf(ids[q])));
      const triName = t => t.v.map(i => ids[i]).join("–");
      const triSigns = t => {                       // az élek előjelei a csúcssorrend szerint: v0v1, v1v2, v0v2
        const [p, q, r] = t.v;
        return [ek[GK.edgeKey(p, q)], ek[GK.edgeKey(q, r)], ek[GK.edgeKey(p, r)]].map(i => signs[i]);
      };
      const triBtns = tris.map((t, k) => btn("", () => { selTri = selTri === k ? -1 : k; selEdge = -1; paint(); }));
      triBox.append(...triBtns);

      function reset() { signs = base.map(r => r.sign); selEdge = -1; selTri = -1; }
      function paint() {
        const triE = selTri >= 0 ? new Set(tris[selTri].e) : null;
        view.edges = base.map((r, i) => {
          const pos = signs[i] > 0, changed = signs[i] !== r.sign, on = (triE && triE.has(i)) || i === selEdge;
          return { a: r.a, b: r.b, w: 1, color: pos ? "--ok" : "--bad", dash: pos ? null : [7, 5],
            width: on ? 5 : 3, label: sgnTxt(signs[i]) + (changed ? "!" : ""), alpha: triE && !triE.has(i) ? 0.25 : 1 };
        });
        view.hl = new Set(selTri >= 0 ? tris[selTri].v : []);
        view.dim = selTri >= 0;
        const pd = new Array(n).fill(0), nd = new Array(n).fill(0);
        base.forEach((r, i) => { const d = signs[i] > 0 ? pd : nd; d[r.a]++; d[r.b]++; });
        view.nodes.forEach((nd0, i) => { nd0.badge = pd[i] + nd[i] ? "+" + pd[i] + (nd[i] ? " " + MINUS + nd[i] : "") : null; });
        view.draw();
        // él-információ
        if (selEdge >= 0) {
          const r = base[selEdge], a = art(r.article), changed = signs[selEdge] !== r.sign;
          info.innerHTML = `<b>${actorName(r.ra)} – ${actorName(r.rb)}</b>: ${signs[selEdge] > 0 ? "támogató (+)" : "bíráló (" + MINUS + ")"}` +
            (changed ? ` <span style="color:var(--bad)">(kitalált változat; az adat szerint ${r.sign > 0 ? "+" : MINUS})</span>` : "") +
            `<br>Forrás: ${a.id}. cikk (${paperName(a.paper)}, ${D.dayNames[a.day]}): „${a.title}”<br><span class="muted">${r.text}</span>`;
        } else info.innerHTML = mode === "flip"
          ? "Kattints egy élre: megfordítom az előjelét. A „!” jelzi a megváltoztatott éleket."
          : "Kattints egy élre a forráscikkért. A csúcs melletti szám: hány pozitív (+) és hány negatív (" + MINUS + ") éle van.";
        // háromszögek
        tris.forEach((t, k) => {
          const s = triSigns(t), prod = s.reduce((x, y) => x * y, 1);
          triBtns[k].textContent = `${triName(t)}  ${s.map(sgnTxt).join("")}  ${prod > 0 ? "✓" : "✗"}`;
          triBtns[k].classList.toggle("on", k === selTri);
          triBtns[k].style.borderColor = prod > 0 ? "var(--ok)" : "var(--bad)";
        });
        if (selTri >= 0) {
          const t = tris[selTri], s = triSigns(t), prod = s.reduce((x, y) => x * y, 1);
          triMsg.innerHTML = `${triName(t)}: előjelek ${s.map(sgnTxt).join(" · ")}, a szorzat <b>${sgnTxt(prod)}</b> → ` +
            (prod > 0 ? "<b>kiegyensúlyozott</b>" : "<b>kiegyensúlyozatlan</b> (feszült)") + " – részletek a 6. fejezetben.";
        } else triMsg.innerHTML = "Egy háromszög akkor <b>kiegyensúlyozott</b>, ha az élek előjeleinek szorzata +, különben <b>kiegyensúlyozatlan</b>.";
        const pos = signs.filter(s => s > 0).length;
        const bal = tris.filter(t => triSigns(t).reduce((x, y) => x * y, 1) > 0).length;
        statRow(stats, [["pozitív él", pos], ["negatív él", signs.length - pos], ["kiegyensúlyozott háromszög", bal + " / " + tris.length]]);
        tab.innerHTML = `<table><tr><th>szereplő</th>${ids.map(id => `<th>${id}</th>`).join("")}</tr>` +
          `<tr><td>pozitív fok</td>${pd.map(x => `<td>${x}</td>`).join("")}</tr>` +
          `<tr><td>negatív fok</td>${nd.map(x => `<td>${x}</td>`).join("")}</tr>` +
          `<tr><td>előjeles erősség</td>${pd.map((x, i) => `<td>${x - nd[i] < 0 ? MINUS + (nd[i] - x) : x - nd[i]}</td>`).join("")}</tr></table>`;
      }
      paint();
    };

    /* ------------------------------------------------------------------
       3.6  multilayer-view – a négy lap három rétegben
       ------------------------------------------------------------------ */
    W["multilayer-view"] = root => {
      header(root, "Többrétegű gráf: a négy lap három rétegben",
        "Kattints egy élre (bármelyik ábrán): a táblázat megmutatja, melyik rétegben milyen súllyal köti össze a két lapot. A jelölőnégyzetekkel választhatod ki, mely rétegek kerüljenek az <b>összevont</b> gráfba.");
      const P = D.papers.map(p => p.id), np = P.length;
      const PPOS = { RH: [0, 0], EK: [1.3, 0], NY: [1.3, 1], VN: [0, 1] };
      const pairKey = (a, b) => GK.edgeKey(a, b);
      const pidx = id => P.indexOf(id);
      /* 1. réteg: hivatkozás (irányított, lapszintre összevonva, lapon belüli nélkül) */
      const cit = {};
      D.citations.forEach(([x, y]) => {
        const a = pidx(art(x).paper), b = pidx(art(y).paper);
        if (a === b) return;
        const k = a + ">" + b; (cit[k] = cit[k] || []).push(x + "→" + y);
      });
      /* 2. réteg: közös esemény (a lap–esemény páros gráf vetülete) */
      const evPapers = D.events.map(e => [...new Set(e.articles.map(a => pidx(art(a).paper)))]);
      /* 3. réteg: közös szereplő (a lap cikkeinek említéseiből) */
      const actOf = P.map(p => new Set(D.articles.filter(a => a.paper === p).flatMap(a => a.mentions)));
      const L = [
        { name: "hivatkozás", short: "hiv.", col: "--accent", directed: true, edges: [] },
        { name: "közös esemény", short: "esem.", col: "#0891b2", edges: [] },
        { name: "közös szereplő", short: "szer.", col: "#db2777", edges: [] }
      ];
      Object.entries(cit).forEach(([k, l]) => { const [a, b] = k.split(">").map(Number); L[0].edges.push({ a, b, w: l.length, det: l.length + " hivatkozás (" + P[a] + " → " + P[b] + "; cikkek: " + l.join(", ") + ")" }); });
      for (let a = 0; a < np; a++) for (let b = a + 1; b < np; b++) {
        const ev = D.events.filter((e, i) => evPapers[i].includes(a) && evPapers[i].includes(b));
        if (ev.length) L[1].edges.push({ a, b, w: ev.length, det: ev.map(e => e.id + " " + e.title).join("; ") });
        const ac = [...actOf[a]].filter(x => actOf[b].has(x));
        if (ac.length) L[2].edges.push({ a, b, w: ac.length, det: ac.map(actorName).join(", ") });
      }
      const on = [true, true, true];
      let selPair = null;                       // "a-b"
      const ctr = h("div", { class: "controls" });
      root.append(ctr);
      L.forEach((l, k) => {
        const cb = h("input", { type: "checkbox", checked: "", onchange: () => { on[k] = cb.checked; paint(); } });
        ctr.append(h("label", null, cb, h("span", { style: `display:inline-block;width:1.4em;height:.3em;border-radius:2px;background:${l.col.startsWith("--") ? `var(${l.col})` : l.col}` }), (k + 1) + ". " + l.name));
      });
      ctr.append(btn("Kijelölés törlése", () => { selPair = null; paint(); }));
      const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:.6rem;align-items:start" });
      root.append(grid);
      const nodesFor = aspect => {
        const Q = GK.normalize(P.map(id => PPOS[id]), aspect);
        return P.map((id, i) => ({ label: id, x: Q[i][0], y: Q[i][1], color: D.papers[i].color }));
      };
      const pick = (i, v) => { const e = v.edges[i]; const k = pairKey(e.a, e.b); selPair = selPair === k ? null : k; paint(); };
      const views = L.map((l, k) => {
        const cell = h("div", { style: "min-width:0;text-align:center" });
        grid.append(cell);
        const v = new GK.View(cell, { aspect: 0.8, maxW: 260, radius: 15, showWeights: true, draggable: false, directed: !!l.directed,
          nodes: nodesFor(0.8), edges: [], onEdgeClick: pick });
        cell.append(h("div", { class: "muted", style: "font-size:.85rem" }, (k + 1) + ". réteg: " + l.name + (l.directed ? " (irányított)" : "")));
        return v;
      });
      const aggCell = h("div", { style: "margin:.6rem auto 0;max-width:420px;text-align:center" });
      root.append(aggCell);
      const agg = new GK.View(aggCell, { aspect: 0.7, maxW: 420, radius: 17, draggable: false, nodes: nodesFor(0.7), edges: [], onEdgeClick: pick });
      const aggCap = h("div", { class: "muted", style: "font-size:.85rem" });
      aggCell.append(aggCap);
      const stats = h("div", { class: "stat-row" });
      const info = h("div", { class: "readout" });
      const tab = h("div", { style: "overflow-x:auto;margin-top:.6rem" });
      root.append(stats, info, tab);

      function paint() {
        views.forEach((v, k) => {
          v.edges = L[k].edges.map(e => {
            const s = pairKey(e.a, e.b) === selPair;
            return { a: e.a, b: e.b, w: e.w, color: L[k].col, width: s ? 5 : 2.5, alpha: !on[k] ? 0.2 : (selPair && !s ? 0.3 : 1) };
          });
          v.draw();
        });
        /* összevont: páronként annyi párhuzamos vonal, ahány (bekapcsolt) rétegben megvan */
        const per = {};
        L.forEach((l, k) => { if (on[k]) l.edges.forEach(e => { const pk = pairKey(e.a, e.b); (per[pk] = per[pk] || []).push(k); }); });
        const ae = [];
        Object.entries(per).forEach(([pk, ks]) => {
          const [a, b] = pk.split("-").map(Number), s = pk === selPair;
          ks.forEach(k => ae.push({ a, b, w: 1, color: L[k].col, width: (s ? 4.5 : 2.5) + ks.length * 0.6, alpha: selPair && !s ? 0.3 : 1 }));
        });
        agg.edges = ae; agg.draw();
        const nl = on.filter(Boolean).length;
        aggCap.textContent = nl ? `összevont gráf (${on.map((x, k) => (x ? k + 1 : null)).filter(Boolean).join(" + ")}. réteg): ahány vonal, annyi rétegben van meg az él` : "összevont gráf: kapcsolj be legalább egy réteget";
        const cnt = [0, 0, 0, 0];
        for (let a = 0; a < np; a++) for (let b = a + 1; b < np; b++) cnt[(per[pairKey(a, b)] || []).length]++;
        statRow(stats, [["összevont él", Object.keys(per).length + " / 6"], ["3 rétegben", cnt[3]], ["2 rétegben", cnt[2]], ["1 rétegben", cnt[1]]]);
        if (!selPair) {
          info.innerHTML = "Válassz egy élt! Érdemes megnézni az <b>EK–NY</b> és az <b>EK–VN</b> párt: mindkettő csak egyetlen rétegben van meg.";
          tab.innerHTML = "";
          return;
        }
        const [a, b] = selPair.split("-").map(Number);
        const rows = L.map((l, k) => {
          const es = l.edges.filter(e => pairKey(e.a, e.b) === selPair);
          return { l, k, w: es.reduce((s, e) => s + e.w, 0), det: es.map(e => e.det).join("; ") };
        });
        const nIn = rows.filter(r => r.w > 0).length;
        info.innerHTML = `<b>${paperName(P[a])} – ${paperName(P[b])}</b>: ${nIn} rétegben összekötve` +
          (nIn && nIn < 3 ? ` (csak: ${rows.filter(r => r.w).map(r => r.l.name).join(", ")})` : "") + ".";
        tab.innerHTML = `<table><tr><th>réteg</th><th>súly</th><th>miből?</th></tr>` +
          rows.map(r => `<tr${on[r.k] ? "" : ' class="muted"'}><td>${r.k + 1}. ${r.l.name}</td><td>${r.w || "–"}</td><td>${r.w ? r.det : "nincs él"}</td></tr>`).join("") + "</table>";
      }
      paint();
    };

    /* ------------------------------------------------------------------
       3.7  kg-explorer – a 12 hármas tudásgráfként
       ------------------------------------------------------------------ */
    W["kg-explorer"] = root => {
      header(root, "Tudásgráf-böngésző",
        "A 12 hármas irányított, címkés élekként. Kattints egy <b>sorra</b> a táblázatban vagy egy <b>élre</b>: kiemelem. Kattints egy <b>csúcsra</b>: kiírom a be- és kimenő hármasait. Lent egyszerű lekérdezést is futtathatsz.");
      const T = D.triples;
      const ENT = { Kormány: "Ko", Vízügy: "Vi", Polgármester: "Po", Lakók: "La", Önkéntesek: "Ön", Szakértő: "Sz", Klímaváltozás: "Kl", Gát: "Gát", Árvíz: "Árv", Védekezők: "Véd" };
      const POS = { Árvíz: [-0.1, -0.3], Klímaváltozás: [1.0, -0.3], Szakértő: [0, 0.5], Kormány: [0.95, 0.6], Védekezők: [2.0, 0.0], Polgármester: [2.3, 1.0],
        Lakók: [3.2, 0.45], Önkéntesek: [3.1, 1.7], Vízügy: [0.1, 1.5], Gát: [1.35, 1.7] };
      const ents = [];
      T.forEach(([s, , o]) => [s, o].forEach(x => { if (!ents.includes(x)) ents.push(x); }));
      const isActor = x => D.actors.some(a => a.name === x);
      const preds = [...new Set(T.map(t => t[1]))];
      const ctr = h("div", { class: "controls" });
      root.append(ctr);
      const narrow = () => root.clientWidth < 560;
      let labMode = narrow() ? "num" : "pred", sel = { kind: null };
      toggleGroup(ctr, [["pred", "élcímke: állítmány"], ["num", "élcímke: sorszám"]], labMode, v => { labMode = v; paint(); });
      ctr.append(btn("Kijelölés törlése", () => { sel = { kind: null }; qS.value = ""; qP.value = ""; paint(); }));
      ctr.append(h("span", { class: "muted", style: "font-size:.85rem" },
        h("span", { style: "color:var(--setA)" }, "●"), " szereplő  ", h("span", { style: "color:var(--setB)" }, "●"), " egyéb entitás"));
      const box = h("div");
      root.append(box);
      const aspect = narrow() ? 0.9 : 0.62;               // keskeny képernyőn magasabb vászon
      const Q = GK.normalize(ents.map(e => POS[e] || [1, 1]), aspect);
      const nodes = ents.map((e, i) => ({ label: ENT[e] || e.slice(0, 3), x: Q[i][0], y: liftY(Q[i][1]), sub: e, color: isActor(e) ? "--setA" : "--setB" }));
      const view = new GK.View(box, { aspect, radius: 16, showWeights: true, directed: true, multiGap: narrow() ? 30 : 44, draggable: true, nodes, edges: [],
        onEdgeClick: i => { sel = sel.kind === "row" && sel.i === i ? { kind: null } : { kind: "row", i }; paint(); },
        onNodeClick: i => { sel = sel.kind === "node" && sel.i === i ? { kind: null } : { kind: "node", i }; paint(); } });
      const info = h("div", { class: "readout" });
      // lekérdező
      const qS = h("select", { onchange: () => { sel = qS.value || qP.value ? { kind: "query" } : { kind: null }; paint(); } }, h("option", { value: "" }, "bármely"), ...ents.map(e => h("option", { value: e }, e)));
      const qP = h("select", { onchange: () => { sel = qS.value || qP.value ? { kind: "query" } : { kind: null }; paint(); } }, h("option", { value: "" }, "bármely"), ...preds.map(p => h("option", { value: p }, p)));
      const qctr = h("div", { class: "controls" }, h("b", null, "Lekérdezés:"), h("label", null, "alany ", qS), h("label", null, "állítmány ", qP), h("span", null, "→ ?tárgy"));
      const tab = h("div", { style: "overflow-x:auto;margin-top:.6rem" });
      root.append(info, qctr, tab);

      function match() {
        if (sel.kind === "row") return new Set([sel.i]);
        if (sel.kind === "node") { const e = ents[sel.i]; return new Set(T.map((t, k) => (t[0] === e || t[2] === e ? k : -1)).filter(k => k >= 0)); }
        if (sel.kind === "query") return new Set(T.map((t, k) => ((!qS.value || t[0] === qS.value) && (!qP.value || t[1] === qP.value) ? k : -1)).filter(k => k >= 0));
        return null;
      }
      const tri = k => `(${T[k][0]}, <i>${T[k][1]}</i>, ${T[k][2]})`;
      function paint() {
        const M = match();
        view.edges = T.map(([s, p, o], k) => {
          const hit = M && M.has(k);
          return { a: ents.indexOf(s), b: ents.indexOf(o), w: 1, label: labMode === "pred" ? p : String(k + 1),
            color: hit ? "--accent" : null, width: hit ? 3.5 : 1.8, alpha: M && !hit ? 0.25 : 1 };
        });
        view.hl = new Set();
        if (sel.kind === "node") view.hl.add(sel.i);
        else if (M) M.forEach(k => { view.hl.add(ents.indexOf(T[k][0])); view.hl.add(ents.indexOf(T[k][2])); });
        view.dim = !!M && view.hl.size > 0;
        view.draw();
        // kiírás
        if (sel.kind === "row") {
          const t = T[sel.i], a = art(t[3]);
          info.innerHTML = `${sel.i + 1}. hármas: <b>${t[0]}</b> → <i>${t[1]}</i> → <b>${t[2]}</b><br>Forrás: ${a.id}. cikk (${paperName(a.paper)}): „${a.title}”`;
        } else if (sel.kind === "node") {
          const e = ents[sel.i];
          const out = T.map((t, k) => k).filter(k => T[k][0] === e), inn = T.map((t, k) => k).filter(k => T[k][2] === e);
          info.innerHTML = `<b>${e}</b> (${isActor(e) ? "szereplő" : "egyéb entitás"}) – kimenő: ${out.length}, bejövő: ${inn.length}` +
            (out.length ? "<br>→ " + out.map(k => `<i>${T[k][1]}</i> ${T[k][2]}`).join(" · ") : "") +
            (inn.length ? "<br>← " + inn.map(k => `${T[k][0]} <i>${T[k][1]}</i>`).join(" · ") : "");
        } else if (sel.kind === "query") {
          const ks = [...M];
          info.innerHTML = `Lekérdezés: (${qS.value || "?alany"}, ${qP.value ? "<i>" + qP.value + "</i>" : "?állítmány"}, ?tárgy) – <b>${ks.length}</b> találat` +
            (ks.length ? "<br>" + ks.map(tri).join("<br>") :
              "<br>Nincs ilyen hármas. Ez <b>nem</b> jelenti, hogy a viszony nem létezik: a tudásgráf „nyílt világ” – ami hiányzik, az lehet, hogy csak nincs benne az adatokban.");
        } else info.innerHTML = `${T.length} hármas, ${ents.length} entitás, ${preds.length} különböző állítmány. Kattints egy sorra, élre vagy csúcsra!`;
        tab.innerHTML = "";
        const tb = h("table", null, h("tr", null, h("th", null, "#"), h("th", null, "alany"), h("th", null, "állítmány"), h("th", null, "tárgy"), h("th", null, "cikk")));
        T.forEach((t, k) => {
          const hit = M && M.has(k);
          const tr = h("tr", { style: "cursor:pointer" + (hit ? ";background:var(--accent-soft);font-weight:600" : "") + (M && !hit ? ";opacity:.55" : ""),
            onclick: () => { sel = sel.kind === "row" && sel.i === k ? { kind: null } : { kind: "row", i: k }; paint(); } },
            h("td", null, String(k + 1)), h("td", null, t[0]), h("td", null, t[1]), h("td", null, t[2]), h("td", null, String(t[3])));
          tb.append(tr);
        });
        tab.append(tb);
      }
      paint();
    };

    /* ------------------------------------------------------------------
       3.8  graph-type-chooser – melyik kérdéshez melyik gráf?
       ------------------------------------------------------------------ */
    W["graph-type-chooser"] = root => {
      header(root, "Melyik gráf kell hozzá?",
        "Nyolc kutatási kérdés. Mindegyikhez válaszd ki a legjobban illő gráftípust! A válasz után megmutatom, miért az a jó – és miért nem a másik.");
      const TY = { vet: "súlyozott vetület", par: "páros gráf", dir: "irányított", sig: "előjeles", tem: "időbeli", mul: "többrétegű", kg: "tudásgráf", hyp: "hipergráf" };
      /* kérdés, helyes válasz, opciók: [típus, indoklás] – az első a helyes */
      const QS = [
        { q: "Kiket kapcsol össze a sajtó: mely szereplők szerepelnek gyakran együtt?", opts: [
          ["vet", "A szereplő–szereplő gráf, ahol a súly a közös cikkek száma (vagy Newman-súlya): ez a cikk–szereplő páros gráf vetülete."],
          ["dir", "Az együttes említésnek nincs iránya: ha Ko és Vi együtt szerepel, Vi és Ko is."],
          ["sig", "Az előjelhez azt kellene tudni, ki támogat és ki bírál kit – a kérdés csak az együttes szereplést kérdezi."],
          ["kg", "A tudásgráf a viszony fajtáját is tárolja; az együttes említéshez elég egy súlyozott gráf."]] },
        { q: "Mely lapok választják ugyanazokat az eseményeket?", opts: [
          ["par", "A lap–esemény páros gráf megmondja, ki miről írt; ebből Jaccard- vagy Newman-vetülettel kapjuk a lapok hasonlóságát."],
          ["dir", "Az irányított gráf a hivatkozást írja le (ki kire hivatkozik), nem azt, hogy ugyanarról írnak-e."],
          ["sig", "A lapok nem „támogatják” vagy „bírálják” egymást – itt a témaválasztás egyezése a kérdés."],
          ["tem", "A napok sorrendje itt mellékes: az számít, melyik eseményről írt a lap, nem az, hogy mikor."]] },
        { q: "Ki kire hivatkozik, melyik lap a forrás?", opts: [
          ["dir", "A hivatkozásnak iránya van (a későbbi cikk a korábbira): a befok mutatja a forrást, a kifok a gyűjtőt. A cikkek hivatkozási gráfja körmentes (DAG)."],
          ["vet", "Irány nélkül a forrás és a gyűjtő összemosódik: nem derül ki, ki hivatkozik kire."],
          ["sig", "A hivatkozás nem támogatás vagy bírálat: előjel helyett irány kell."],
          ["hyp", "Egy hivatkozás mindig két cikket köt össze: nincs szükség többcsúcsú élre."]] },
        { q: "Ki támogat, ki bírál kit?", opts: [
          ["sig", "Minden él előjelet kap: + támogat, − bírál. (Ha az is számít, ki szól kiről, akkor előjeles és irányított.)"],
          ["vet", "Az együttes említés elrejti a vitát: a szakértő és a kormány „együtt szerepel”, pedig a szakértő bírálja a kormányt."],
          ["dir", "Az irány megmondja, ki szól kiről, de azt nem, hogy támogatja vagy bírálja – ehhez előjel kell."],
          ["mul", "Két rétegbe (támogat / bírál) is szét lehet bontani, de a háromszögek előjel-szabályához az előjeles gráf a természetes forma."]] },
        { q: "Hogyan változik a tudósítás napról napra? Eljuthatott-e egy téma egy szereplőig időrendben?", opts: [
          ["tem", "Az időbélyeges élek mutatják a sorrendet; időben haladó út csak akkor van, ha az élek napjai nem csökkennek."],
          ["vet", "Az összevont gráf hamis utakat mutat: olyan útvonalat is, amely időben „visszafelé” haladna."],
          ["sig", "Az előjel a viszony jellegét írja le, nem az időpontját."],
          ["kg", "A hármasok önmagukban nem tárolják a sorrendet; az időbélyeg kell hozzá."]] },
        { q: "Hasonlítanak-e a lapok – többféle értelemben is (hivatkozás, közös esemény, közös szereplő)?", opts: [
          ["mul", "Ugyanaz a négy lap, rétegenként másféle éllel. Rétegenként összevethető, hol hasonlóak és hol nem."],
          ["vet", "Egyetlen összevont gráf mindent összemos: az EK–NY pár ugyanúgy „összekötött”, mint az RH–VN, pedig csak egy rétegben van meg."],
          ["kg", "A tudásgráf entitások közötti állításokat tárol; a lapok hasonlóságát rétegenként érdemes mérni."],
          ["par", "A páros gráf csak egyféle kapcsolatot ír le (pl. lap–esemény) – itt egyszerre három fajta kell."]] },
        { q: "Mit állítanak a cikkek – ki mit tesz kivel –, és melyik cikk mondja?", opts: [
          ["kg", "(alany, állítmány, tárgy) hármasok, mindegyik mellé a forráscikk: irányított, címkés élű multigráf."],
          ["sig", "Az előjel csak két értéket ismer (+/−); a „segélyt küld”, „bejárja”, „fórumot tart” viszonyok fajtája elveszne."],
          ["dir", "Az irány megvan, de a címke (az állítmány) nélkül nem tudjuk, milyen viszonyról van szó."],
          ["vet", "Az együttes említés se irányt, se viszonyfajtát nem tárol."]] },
        { q: "Mely szereplők szerepeltek együtt egy cikkben – úgy, hogy egy háromszereplős cikk ne essen szét három párra?", opts: [
          ["hyp", "Minden cikk egy hiperél a szereplői fölött: a 2. cikk egyetlen {Ko, Vi, Po} hiperél, nem három külön él. (Egyenértékű a cikk–szereplő páros gráffal.)"],
          ["vet", "A vetületben a {Ko, Vi, Po} cikk egy háromszög lesz – ugyanaz, mintha három kétszereplős cikk lett volna."],
          ["sig", "Az előjel a viszony jellegét adja meg, a csoportos együttszereplést nem."],
          ["tem", "Az időbélyeg megmondja, mikor jelent meg a cikk, de a cikk szereplői attól még párokra esnének szét."]] }
      ];
      let order, cur, score, answered, results;
      const prog = h("div", { class: "stat-row" });
      const card = h("div", { class: "box", style: "margin:.6rem 0" });
      root.append(prog, card);
      const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
      function start() { order = QS.map((q, i) => i); cur = 0; score = 0; answered = false; results = []; show(); }
      function show() {
        statRow(prog, [["kérdés", Math.min(cur + 1, QS.length) + " / " + QS.length], ["pontszám", score + " / " + results.length]]);
        card.innerHTML = "";
        if (cur >= QS.length) {
          card.append(h("p", { style: "margin:0 0 .4rem;font-weight:700" }, `Vége! Eredmény: ${score} / ${QS.length}`),
            h("p", { class: "muted", style: "margin:0 0 .5rem" }, score === QS.length ? "Hibátlan – minden kérdéshez a megfelelő nézetet választottad." :
              "Nézd meg újra a 3.8 döntési táblázatát a hibás kérdéseknél: " + results.map((r, k) => (r ? null : k + 1)).filter(Boolean).join(", ") + "."),
            h("div", { class: "controls" }, btn("Újra", start, "btn primary")));
          return;
        }
        const Qd = QS[order[cur]];
        const opts = shuffle(Qd.opts.map((o, k) => ({ t: o[0], why: o[1], ok: k === 0 })));
        const msg = h("div", { class: "readout", style: "display:none" });
        const next = btn(cur + 1 < QS.length ? "Következő →" : "Eredmény", () => { cur++; answered = false; show(); }, "btn primary");
        next.style.display = "none";
        const bs = opts.map(o => btn(TY[o.t], () => {
          if (answered) return;
          answered = true;
          if (o.ok) score++;
          results.push(o.ok);
          bs.forEach((b, k) => {
            b.disabled = true;
            if (opts[k].ok) { b.style.borderColor = "var(--ok)"; b.style.background = "var(--ok-soft)"; b.style.color = "var(--ok)"; b.style.fontWeight = "700"; }
            else if (opts[k] === o) { b.style.borderColor = "var(--bad)"; b.style.background = "var(--bad-soft)"; b.style.color = "var(--bad)"; }
            else b.style.opacity = ".6";
          });
          const good = opts.find(x => x.ok);
          msg.innerHTML = o.ok ? `✓ <b>Helyes: ${TY[good.t]}.</b> ${good.why}`
            : `✗ <b>${TY[o.t]}</b>: ${o.why}<br>✓ <b>Jobb: ${TY[good.t]}.</b> ${good.why}`;
          msg.style.display = ""; next.style.display = "";
          statRow(prog, [["kérdés", (cur + 1) + " / " + QS.length], ["pontszám", score + " / " + results.length]]);
        }));
        card.append(h("p", { style: "margin:0 0 .3rem;font-weight:600" }, `${cur + 1}. ${Qd.q}`), h("div", { class: "controls" }, ...bs), msg, h("div", { class: "controls" }, next));
      }
      start();
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
