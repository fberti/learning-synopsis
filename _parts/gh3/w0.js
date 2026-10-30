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
