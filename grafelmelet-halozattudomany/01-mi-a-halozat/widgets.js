/* =========================================================
   Gráfelmélet és hálózattudomány 1. fejezet – interaktív szemléltetések
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

  const W = {};

  /* ------------------------------------------------------------------
     1.2  three-graphs – ugyanabból az adatból többféle gráf
     ------------------------------------------------------------------ */
  W["three-graphs"] = root => {
    header(root, "Ugyanaz az adat – négyféle gráf",
      "Válaszd ki, mi legyen a csúcs, és mi az élszabály! Kattints egy csúcsra: kiemelődnek a szomszédai, és alul megjelenik, miért van él.");
    const ctr = h("div", { class: "controls" });
    const ctr2 = h("div", { class: "controls" });
    root.append(ctr, ctr2);
    let model = "actor", scope = "four", kmin = 1;
    toggleGroup(ctr, [["actor", "Szereplőgráf"], ["article", "Cikkgráf"], ["paper", "Lapgráf"], ["bip", "Cikk–szereplő"]], model, v => { model = v; build(); });
    toggleGroup(ctr2, [["four", "4 cikk (2, 5, 8, 10)"], ["all", "a teljes hét (12 cikk)"]], scope, v => { scope = v; build(); });
    const kLab = h("label", null, "él, ha legalább ");
    const kSel = h("select", { onchange: () => { kmin = +kSel.value; build(); } }, ["1", "2", "3"].map(v => h("option", { value: v }, v)));
    kLab.append(kSel, " közös szereplő");
    ctr2.append(kLab);
    const rule = h("p", { class: "readout" });
    const box = h("div");
    root.append(rule, box);
    const info = h("p", { class: "readout" });
    const stats = h("div", { class: "stat-row" });
    root.append(stats, info);
    const view = new GK.View(box, { aspect: 0.6, radius: 16, weightWidth: true,
      onNodeClick: i => { focus = focus === i ? -1 : i; paint(); } });
    let focus = -1, G = null;

    function articles() { return scope === "four" ? D.articles.filter(a => [2, 5, 8, 10].includes(a.id)) : D.articles; }
    function build() {
      const arts = articles(); focus = -1;
      kLab.style.display = model === "article" || model === "paper" ? "" : "none";
      const aspect = view.o.aspect;
      let nodes = [], edges = [], why = [];
      if (model === "actor") {
        const used = new Set(arts.flatMap(a => a.mentions));
        const pos = actorPositions(aspect);
        const ids = D.actors.map(a => a.id).filter(id => used.has(id));
        nodes = ids.map(id => ({ label: id, x: pos[id][0], y: pos[id][1], sub: actorName(id) }));
        const pairs = cooc(arts);
        Object.entries(pairs).forEach(([k, list]) => {
          const [u, v] = k.split("|");
          edges.push({ a: ids.indexOf(u), b: ids.indexOf(v), w: list.length });
          why.push("cikk " + list.join(", "));
        });
        rule.innerHTML = "<b>Csúcs:</b> szereplő. <b>Élszabály:</b> a két szereplő legalább egy cikkben együtt szerepel. (Vastagság: hány cikkben.)";
      } else if (model === "article") {
        nodes = arts.map(a => ({ label: String(a.id), color: paper(a.paper).color, sub: a.paper }));
        for (let i = 0; i < arts.length; i++) for (let j = i + 1; j < arts.length; j++) {
          const s = arts[i].mentions.filter(x => arts[j].mentions.includes(x));
          if (s.length >= kmin) { edges.push({ a: i, b: j, w: s.length }); why.push("közös: " + s.map(actorName).join(", ")); }
        }
        rule.innerHTML = `<b>Csúcs:</b> cikk (színe: a lap). <b>Élszabály:</b> a két cikknek legalább ${kmin} közös szereplője van.`;
      } else if (model === "paper") {
        const ps = D.papers.filter(p => arts.some(a => a.paper === p.id));
        const act = p => new Set(arts.filter(a => a.paper === p.id).flatMap(a => a.mentions));
        nodes = ps.map(p => ({ label: p.id, color: p.color, sub: p.name }));
        for (let i = 0; i < ps.length; i++) for (let j = i + 1; j < ps.length; j++) {
          const A = act(ps[i]), B = act(ps[j]), s = [...A].filter(x => B.has(x));
          if (s.length >= kmin) { edges.push({ a: i, b: j, w: s.length }); why.push("közös: " + s.map(actorName).join(", ")); }
        }
        rule.innerHTML = `<b>Csúcs:</b> lap. <b>Élszabály:</b> a két lap cikkeiben legalább ${kmin} közös szereplő van.`;
      } else {
        const used = D.actors.map(a => a.id).filter(id => arts.some(a => a.mentions.includes(id)));
        nodes = arts.map((a, i) => ({ label: String(a.id), color: paper(a.paper).color, x: 0.14, y: 0.08 + 0.84 * (arts.length > 1 ? i / (arts.length - 1) : 0.5) }))
          .concat(used.map((id, i) => ({ label: id, x: 0.86, y: 0.08 + 0.84 * (used.length > 1 ? i / (used.length - 1) : 0.5), sub: "" })));
        arts.forEach((a, i) => a.mentions.forEach(id => { edges.push({ a: i, b: arts.length + used.indexOf(id), w: 1 }); why.push("a cikk említi"); }));
        rule.innerHTML = "<b>Csúcs:</b> cikk (bal oldal) és szereplő (jobb oldal). <b>Élszabály:</b> a cikk említi a szereplőt. Két cikk vagy két szereplő között nincs él.";
      }
      G = { why };
      view.setGraph(nodes, edges);
      if (model === "article" || model === "paper") view.layout(model === "paper" ? 3 : 11);
      paint();
    }
    function paint() {
      view.hl.clear(); view.hlE.clear(); view.dim = focus >= 0;
      const n = view.nodes.length, m = view.edges.length;
      const deg = GK.degrees(n, view.edgeList());
      view.nodes.forEach((nd, i) => (nd.badge = deg[i]));
      if (focus >= 0) {
        view.hl.add(focus);
        const lines = [];
        view.edges.forEach((e, k) => {
          if (e.a === focus || e.b === focus) {
            const o = e.a === focus ? e.b : e.a;
            view.hl.add(o); view.hlE.add(GK.edgeKey(e.a, e.b));
            lines.push(`<b>${view.nodes[o].label}</b> (${G.why[k]})`);
          }
        });
        info.innerHTML = `<b>${view.nodes[focus].label}</b> szomszédai (${lines.length}): ` + (lines.join(" · ") || "nincs – izolált csúcs");
      } else info.innerHTML = "Kattints egy csúcsra! A csúcsok melletti szám a fokszám.";
      stats.innerHTML = "";
      [["csúcs", n], ["él", m]].concat(model === "bip" ? [] : [["sűrűség", n > 1 ? fmt(m / binom2(n)) : "–"]]).forEach(([l, v]) =>
        stats.append(h("div", { class: "stat" }, h("div", { class: "v" }, String(v)), h("div", { class: "l" }, l))));
      view.draw();
    }
    build();
  };

  /* ------------------------------------------------------------------
     1.3  handshake – rajzolható-e a fokszámsorozat?
     ------------------------------------------------------------------ */
  W["handshake"] = root => {
    header(root, "Kézfogási lemma: rajzolható-e a fokszámsorozat?",
      "Állítsd be a csúcsok fokszámát a + és − gombokkal! A gép ellenőrzi a feltételeket, és ha lehet, rajzol is egy ilyen egyszerű gráfot.");
    const pre = h("div", { class: "controls" });
    root.append(pre);
    let deg = [3, 3, 2, 2, 2];
    [["(1, 2, 2, 3, 3)", [1, 2, 2, 3, 3]], ["(3, 3, 1, 1)", [3, 3, 1, 1]], ["(3, 3, 3, 3, 3, 3)", [3, 3, 3, 3, 3, 3]], ["(5, 3, 3, 3, 2)", [5, 3, 3, 3, 2]],
     ["Árvízhét (4, 4, 3, 3, 2, 2, 2)", [4, 4, 3, 3, 2, 2, 2]]].forEach(([l, d]) => pre.append(btn(l, () => { deg = d.slice(); upd(); })));
    const steppers = h("div", { class: "controls" });
    const nCtr = h("div", { class: "controls" },
      h("span", null, "csúcsok száma: "),
      btn("−", () => { if (deg.length > 1) { deg.pop(); upd(); } }),
      btn("+", () => { if (deg.length < 8) { deg.push(1); upd(); } }));
    root.append(nCtr, steppers);
    const checks = h("div", { class: "readout" });
    const box = h("div");
    root.append(checks, box);
    const view = new GK.View(box, { aspect: 0.5, radius: 16 });

    function havelHakimi(d) {
      const left = d.map((v, i) => ({ i, v })), edges = [];
      for (;;) {
        left.sort((a, b) => b.v - a.v || a.i - b.i);
        if (!left.length || left[0].v === 0) return edges;
        const top = left.shift();
        if (top.v > left.length) return null;
        for (let k = 0; k < top.v; k++) { if (left[k].v === 0) return null; left[k].v--; edges.push([top.i, left[k].i]); }
      }
    }
    function erdosGallai(d) {
      const s = d.slice().sort((a, b) => b - a), n = s.length;
      for (let k = 1; k <= n; k++) {
        const L = s.slice(0, k).reduce((a, b) => a + b, 0);
        const R = k * (k - 1) + s.slice(k).reduce((a, b) => a + Math.min(b, k), 0);
        if (L > R) return { k, L, R };
      }
      return null;
    }
    function upd() {
      steppers.innerHTML = "";
      deg.forEach((v, i) => {
        const lab = String.fromCharCode(65 + i);
        steppers.append(h("span", { style: "display:inline-flex;align-items:center;gap:.2rem;margin-right:.6rem" },
          h("b", null, lab + ":"), btn("−", () => { if (deg[i] > 0) { deg[i]--; upd(); } }), h("span", { style: "min-width:1.2em;text-align:center" }, String(v)),
          btn("+", () => { deg[i]++; upd(); })));
      });
      const n = deg.length, sum = deg.reduce((a, b) => a + b, 0), odd = deg.filter(v => v % 2).length, mx = Math.max(...deg);
      const ok1 = sum % 2 === 0, ok2 = mx <= n - 1, eg = ok1 && ok2 ? erdosGallai(deg) : null;
      const line = (ok, txt) => `<div>${ok ? "✅" : "❌"} ${txt}</div>`;
      let html = line(ok1, `fokszámösszeg: ${deg.join(" + ")} = <b>${sum}</b> ${ok1 ? `páros → $m = ${sum / 2}$` : "páratlan → nem lehet $2m$"}; páratlan fokú csúcs: ${odd} db`);
      html += line(ok2, `legnagyobb fokszám ${mx} ${ok2 ? "≤" : ">"} $n - 1 = ${n - 1}$`);
      if (ok1 && ok2) html += line(!eg, eg ? `Erdős–Gallai-feltétel sérül $k = ${eg.k}$-ra: a $${eg.k}$ legnagyobb fokszám összege ${eg.L} > ${eg.R}` : "Erdős–Gallai-feltétel teljesül");
      const E = ok1 && ok2 && !eg ? havelHakimi(deg) : null;
      html += E ? `<div><b>Rajzolható!</b> Egy lehetséges gráf ${E.length} éllel:</div>` : `<div><b>Nincs ilyen egyszerű gráf.</b></div>`;
      checks.innerHTML = html;
      math(checks);
      const P = GK.circleLayout(n);
      view.setGraph(deg.map((v, i) => ({ label: String.fromCharCode(65 + i), x: 0.5 + (P[i][0] - 0.5) * 0.62, y: 0.06 + P[i][1] * 0.88, badge: v })),
        E ? E.map(([a, b]) => ({ a, b })) : []);
      view.dim = !E;
    }
    upd();
  };

  /* ------------------------------------------------------------------
     1.4  graph-draw – rajzold meg, a gép számol
     ------------------------------------------------------------------ */
  W["graph-draw"] = root => {
    header(root, "Gráfrajzoló: lista, mátrix, fokszámok",
      "<b>Üres helyre kattintás:</b> új csúcs. <b>Egy csúcs, majd egy másik:</b> él be / ki. <b>Élre kattintás:</b> él törlése. <b>Húzás:</b> mozgatás. Minden szám élőben frissül.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    const box = h("div");
    root.append(box);
    const stats = h("div", { class: "stat-row" });
    const tabs = h("div", { class: "controls" });
    const out = h("div", { class: "tw", style: "overflow-x:auto" });
    root.append(stats, tabs, out);
    let tab = "matrix";
    const view = new GK.View(box, { aspect: 0.5, radius: 16, editable: true, maxNodes: 12, onChange: () => upd(), onMove: () => {} });
    const preset = (edgesStr, layout = "circle") => {
      const g = GK.parseEdges(edgesStr);
      const P = layout === "circle" ? GK.circleLayout(g.labels.length) : GK.forceLayout(g.labels.length, g.edges, { aspect: 0.5, seed: 5 });
      view.setGraph(g.labels.map((l, i) => ({ label: l, x: P[i][0], y: layout === "circle" ? 0.06 + P[i][1] * 0.88 : P[i][1] })), g.edges.map(([a, b]) => ({ a, b })));
      upd();
    };
    ctr.append(
      btn("Barátok", () => preset("A-B,A-C,B-C,C-D", "force")),
      btn("Árvízhét", () => {
        const pos = actorPositions(0.5), ids = D.actors.map(a => a.id), pairs = cooc(D.articles);
        view.setGraph(ids.map(id => ({ label: id, x: pos[id][0], y: pos[id][1] })),
          Object.keys(pairs).map(k => { const [u, v] = k.split("|"); return { a: ids.indexOf(u), b: ids.indexOf(v) }; }));
        upd();
      }),
      btn("$K_5$", () => preset("A-B,A-C,A-D,A-E,B-C,B-D,B-E,C-D,C-E,D-E")),
      btn("$C_6$", () => preset("A-B,B-C,C-D,D-E,E-F,F-A")),
      btn("Átszámozás", () => {
        const n = view.nodes.length, perm = [...Array(n).keys()].sort(() => Math.random() - 0.5);
        const inv = []; perm.forEach((p, i) => (inv[p] = i));
        view.nodes = perm.map(p => view.nodes[p]);
        view.edges = view.edges.map(e => ({ ...e, a: inv[e.a], b: inv[e.b] }));
        view.sel = -1; upd();
      }),
      btn("Kijelölt csúcs törlése", () => { if (view.sel >= 0) { view.removeNode(view.sel); upd(); } }),
      btn("Mind törlése", () => { view.setGraph([], []); upd(); }));
    toggleGroup(tabs, [["edges", "Éllista"], ["adj", "Szomszédsági lista"], ["matrix", "Szomszédsági mátrix"]], tab, v => { tab = v; upd(); });
    function upd() {
      const n = view.nodes.length, E = view.edgeList(), m = E.length, d = GK.degrees(n, E), L = view.nodes.map(x => x.label);
      view.nodes.forEach((x, i) => (x.badge = d[i]));
      view.draw();
      const sum = d.reduce((a, b) => a + b, 0);
      stats.innerHTML = "";
      [["$n$", n], ["$m$", m], ["$\\sum d(v)$", sum], ["$2m$", 2 * m], ["$\\bar d$", n ? fmt(2 * m / n) : "–"], ["sűrűség $\\rho$", n > 1 ? fmt(m / binom2(n)) : "–"]]
        .forEach(([l, v]) => stats.append(h("div", { class: "stat" }, h("div", { class: "v" }, String(v)), h("div", { class: "l" }, l))));
      const sel = view.sel;
      if (tab === "edges") out.innerHTML = m ? "<p>" + E.map(([a, b]) => L[a] + L[b]).join(", ") + "</p>" + (d.some(x => x === 0) ? `<p class="muted">izolált: ${L.filter((_, i) => !d[i]).join(", ")}</p>` : "") : "<p class='muted'>nincs él</p>";
      else if (tab === "adj") {
        const A = GK.adjList(n, E);
        out.innerHTML = "<table>" + A.map((l, i) => `<tr><th${i === sel ? ' class="hl"' : ""}>${L[i]}</th><td>${l.map(j => L[j]).join(", ") || "–"}</td><td class="muted">${d[i]}</td></tr>`).join("") + "</table>";
      } else {
        const M = GK.adjMatrix(n, E);
        out.innerHTML = n ? `<table class="adj"><tr><th></th>${L.map((l, j) => `<th${j === sel ? ' class="hl"' : ""}>${l}</th>`).join("")}<th>Σ</th></tr>` +
          M.map((r, i) => `<tr><th${i === sel ? ' class="hl"' : ""}>${L[i]}</th>${r.map((v, j) => `<td class="${v ? "one" : ""}${i === sel || j === sel ? " hl" : ""}">${v}</td>`).join("")}<td>${d[i]}</td></tr>`).join("") + "</table>" : "<p class='muted'>üres</p>";
      }
      math(stats);
    }
    preset("A-B,A-C,B-C,C-D", "force");
    math(ctr);
  };

  /* ------------------------------------------------------------------
     1.6  named-graphs – nevezetes gráfok és komplementer
     ------------------------------------------------------------------ */
  W["named-graphs"] = root => {
    header(root, "Nevezetes gráfok és a komplementerük",
      "Válassz típust és méretet! A kapcsolóval a komplementert látod: ugyanazok a csúcsok, a hiányzó élekkel.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    let type = "K", n = 5, comp = false;
    toggleGroup(ctr, [["K", "teljes $K_n$"], ["P", "út $P_n$"], ["C", "kör $C_n$"], ["S", "csillag $K_{1,n}$"], ["E", "üres"]], type, v => { type = v; upd(); });
    const sl = h("input", { type: "range", min: 1, max: 10, step: 1, value: n, oninput: () => { n = +sl.value; upd(); } });
    const nLab = h("b");
    const cb = h("input", { type: "checkbox", onchange: () => { comp = cb.checked; upd(); } });
    const ctr2 = h("div", { class: "controls" }, h("label", null, "$n$ = ", nLab, " ", sl), h("label", null, cb, " komplementer"));
    root.append(ctr2);
    const box = h("div");
    root.append(box);
    const read = h("div", { class: "readout" });
    root.append(read);
    const view = new GK.View(box, { aspect: 0.5, radius: 14 });
    math(ctr); math(ctr2);
    function upd() {
      const minN = type === "C" ? 3 : 1;
      if (n < minN) { n = minN; sl.value = n; }
      nLab.textContent = n;
      const N = type === "S" ? n + 1 : n;
      let E = [];
      if (type === "K") for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) E.push([i, j]);
      if (type === "P") for (let i = 0; i + 1 < N; i++) E.push([i, i + 1]);
      if (type === "C") { for (let i = 0; i + 1 < N; i++) E.push([i, i + 1]); E.push([N - 1, 0]); }
      if (type === "S") for (let i = 1; i < N; i++) E.push([0, i]);
      if (comp) {
        const has = new Set(E.map(([a, b]) => GK.edgeKey(a, b))), C = [];
        for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) if (!has.has(GK.edgeKey(i, j))) C.push([i, j]);
        E = C;
      }
      let P;
      if (type === "P") P = Array.from({ length: N }, (_, i) => [N === 1 ? 0.5 : 0.06 + 0.88 * i / (N - 1), comp ? 0.5 + (i % 2 ? 0.25 : -0.25) : 0.5]);
      else if (type === "S") P = [[0.5, 0.5]].concat(GK.circleLayout(n).map(p => [0.5 + (p[0] - 0.5) * 0.62, 0.04 + p[1] * 0.92]));
      else P = GK.circleLayout(N).map(p => [0.5 + (p[0] - 0.5) * 0.62, 0.04 + p[1] * 0.92]);
      if (type === "S" && n === 1) P = [[0.35, 0.5], [0.65, 0.5]];
      const d = GK.degrees(N, E);
      view.setGraph(P.map((p, i) => ({ label: String(i + 1), x: p[0], y: p[1], badge: d[i] })), E.map(([a, b]) => ({ a, b })));
      const m = E.length, all = binom2(N);
      const names = { K: "K_{" + n + "}", P: "P_{" + n + "}", C: "C_{" + n + "}", S: "K_{1," + n + "}", E: "\\overline{K_{" + n + "}}" };
      const formula = { K: `\\binom{${n}}{2} = ${binom2(n)}`, P: `n - 1 = ${n - 1}`, C: `n = ${n}`, S: `n = ${n}`, E: "0" }[type];
      read.innerHTML = `$${comp ? "\\overline{" + names[type] + "}" : names[type]}$: <b>${N}</b> csúcs, <b>${m}</b> él` +
        (comp ? ` (= $\\binom{${N}}{2} - ${all - m} = ${all} - ${all - m}$)` : ` (képlet: $${formula}$)`) +
        `, fokszámsorozat: (${d.slice().sort((a, b) => b - a).join(", ")}), sűrűség: ${N > 1 ? fmt(m / all) : "–"}.`;
      math(read);
    }
    upd();
  };

  /* ------------------------------------------------------------------
     1.6  isomorphism-game – ugyanaz-e a két gráf?
     ------------------------------------------------------------------ */
  W["isomorphism-game"] = root => {
    header(root, "Izomorf-e a két gráf?",
      "Döntsd el! A jobb oldali gráf csúcsai húzhatók – próbáld úgy elrendezni, hogy fedje a bal oldalit. Válasz után a gép megmutatja az invariánsokat, és ha izomorfak, a megfeleltetést is.");
    const pent = "1:0,-1 2:.951,-.309 3:.588,.809 4:-.588,.809 5:-.951,-.309";
    const PZ = [
      { t: "Ötszög és ötágú csillag", L: "1-2,2-3,3-4,4-5,5-1", Lp: pent, R: "1-3,3-5,5-2,2-4,4-1", Rp: pent, map: { 1: "1", 2: "3", 3: "5", 4: "2", 5: "4" } },
      { t: "Kör és két háromszög", L: "1-2,2-3,3-4,4-5,5-6,6-1", R: "a-b,b-c,c-a,d-e,e-f,f-d", Rp: "a:0,0 b:1,0 c:.5,.85 d:2,0 e:3,0 f:2.5,.85", map: null },
      { t: "Reggeli Hírlap és Nyitott Szó", L: "Ko-Vi,Ko-Po,Vi-Po", Lp: "Ko:.5,0 Vi:0,.85 Po:1,.85", R: "La-Ön,La-Po,Ön-Po", Rp: "La:0,.2 Ön:1.3,0 Po:.4,1", map: { Ko: "La", Vi: "Ön", Po: "Po" } },
      { t: "Ház, kétféleképpen", L: "1-2,2-3,3-4,4-1,1-5,2-5", Lp: "5:.5,-.8 1:0,0 2:1,0 3:1,1 4:0,1", R: "a-c,c-e,e-b,b-a,a-d,c-d", Rp: "a:0,0 b:1,.2 c:.2,1 d:-.6,.7 e:1.1,1.1",
        map: { 1: "a", 2: "c", 3: "e", 4: "b", 5: "d" } },
      { t: "Csillag és út", L: "1-2,1-3,1-4", Lp: "1:0,0 2:0,-1 3:.9,.5 4:-.9,.5", R: "a-b,b-c,c-d", Rp: "a:0,0 b:1,0 c:2,0 d:3,0", map: null },
      { t: "Azonos fokszámsorozat", L: "a-b,b-c,c-a,c-d,d-e", Lp: "a:0,0 b:0,1 c:.8,.5 d:1.7,.5 e:2.5,.5", R: "1-2,2-3,3-4,4-1,1-5", Rp: "1:1,0 2:1,1 3:0,1 4:0,0 5:2,0", map: null }
    ];
    let k = 0;
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    const sel = h("select", { onchange: () => { k = +sel.value; load(); } }, PZ.map((p, i) => h("option", { value: i }, (i + 1) + ". " + p.t)));
    ctr.append(sel, btn("Izomorf", () => answer(true)), btn("Nem izomorf", () => answer(false)));
    const row = h("div", { class: "two-col" });
    const lb = h("div"), rb = h("div");
    row.append(lb, rb);
    root.append(row);
    const fb = h("div", { class: "readout" });
    const ctr2 = h("div", { class: "controls" });
    root.append(fb, ctr2);
    const showBtn = btn("Mutasd a megfeleltetést", () => showMap());
    ctr2.append(showBtn);
    const LV = new GK.View(lb, { aspect: 0.8, maxW: 360, radius: 15, draggable: false });
    const RV = new GK.View(rb, { aspect: 0.8, maxW: 360, radius: 15 });
    function mk(view, str, pos) {
      const g = GK.parseEdges(str);
      let P;
      if (pos) {
        const raw = {}; pos.split(/\s+/).forEach(t => { const [l, xy] = t.split(":"); raw[l] = xy.split(",").map(Number); });
        P = GK.normalize(g.labels.map(l => raw[l]), 0.8);
      } else P = GK.circleLayout(g.labels.length).map(p => [p[0], 0.04 + p[1] * 0.92]);
      view.setGraph(g.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), g.edges.map(([a, b]) => ({ a, b })));
      return g;
    }
    function inv(g) {
      const n = g.labels.length, E = g.edges, d = GK.degrees(n, E).sort((a, b) => b - a);
      const A = GK.adjMatrix(n, E); let t = 0;
      for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let l = j + 1; l < n; l++) if (A[i][j] && A[j][l] && A[i][l]) t++;
      const seen = new Array(n).fill(false), L = GK.adjList(n, E); let c = 0;
      for (let s = 0; s < n; s++) if (!seen[s]) { c++; const st = [s]; seen[s] = true; while (st.length) { const u = st.pop(); L[u].forEach(v => { if (!seen[v]) { seen[v] = true; st.push(v); } }); } }
      return { n, m: E.length, d: "(" + d.join(", ") + ")", t, c };
    }
    let gl, gr;
    function load() {
      gl = mk(LV, PZ[k].L, PZ[k].Lp); gr = mk(RV, PZ[k].R, PZ[k].Rp);
      fb.innerHTML = "Döntsd el: ugyanaz a gráf, csak másképp rajzolva és elnevezve?";
      showBtn.style.display = "none";
    }
    function answer(yes) {
      const iso = !!PZ[k].map, a = inv(gl), b = inv(gr);
      const row = (l, x, y) => `<tr><td>${l}</td><td>${x}</td><td>${y}</td><td>${x === y ? "=" : "<b>≠</b>"}</td></tr>`;
      fb.innerHTML = (yes === iso ? "✅ <b>Helyes!</b> " : "❌ <b>Nem egészen.</b> ") + (iso ? "A két gráf izomorf." : "A két gráf nem izomorf.") +
        `<table style="margin-top:.4rem"><tr><th>invariáns</th><th>bal</th><th>jobb</th><th></th></tr>${row("csúcsok", a.n, b.n)}${row("élek", a.m, b.m)}${row("fokszámsorozat", a.d, b.d)}${row("háromszögek", a.t, b.t)}${row("darabok (komponensek)", a.c, b.c)}</table>` +
        (iso ? "" : (a.d === b.d && a.n === b.n && a.m === b.m ? "<p>A csúcs- és élszám és a fokszámsorozat is egyezik, mégsem izomorfak: egy másik invariáns eltér. A fokszámsorozat nem elég!</p>" : ""));
      showBtn.style.display = iso ? "" : "none";
    }
    function showMap() {
      const map = PZ[k].map, T = RV.nodes.map(() => null);
      Object.entries(map).forEach(([l, r]) => {
        const li = LV.nodes.findIndex(x => x.label === l), ri = RV.nodes.findIndex(x => x.label === r);
        T[ri] = [LV.nodes[li].x, LV.nodes[li].y];
      });
      RV.animateTo(T, 900);
      fb.innerHTML += "<p>Megfeleltetés: " + Object.entries(map).map(([l, r]) => `${l} ↦ ${r}`).join(", ") + ". A jobb oldali csúcsok a bal oldali párjuk helyére mennek – az élek fedik egymást.</p>";
    }
    load();
  };

  /* ------------------------------------------------------------------
     1.7  cooccurrence-builder – az Árvízhét szereplőgráfja cikkről cikkre
     ------------------------------------------------------------------ */
  W["cooccurrence-builder"] = root => {
    header(root, "Az Árvízhét szereplőgráfja – cikkről cikkre",
      "Kattints a cikkkártyákra a be- és kikapcsoláshoz, vagy szűrj lapra! Vidd az egeret egy kártya fölé: kiemelődik, milyen éleket ad (egy cikk = egy klikk). Az élek vastagsága: hány bekapcsolt cikkben szerepel együtt a pár.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    const on = new Set(D.articles.map(a => a.id));
    const setPaper = pid => { on.clear(); D.articles.forEach(a => { if (!pid || a.paper === pid) on.add(a.id); }); upd(); };
    toggleGroup(ctr, [["", "Mind"]].concat(D.papers.map(p => [p.id, p.name])), "", v => setPaper(v));
    ctr.append(btn("Egyik sem", () => { on.clear(); upd(); }));
    const cards = h("div", { class: "art-cards" });
    const box = h("div");
    const stats = h("div", { class: "stat-row" });
    const read = h("div", { class: "readout" });
    root.append(box, stats, read, cards);
    const pos = actorPositions(0.55), ids = D.actors.map(a => a.id);
    const view = new GK.View(box, { aspect: 0.55, radius: 17, showWeights: true });
    let hover = -1;
    const cardEls = D.articles.map(a => {
      const p = paper(a.paper);
      const c = h("div", { class: "art-card", style: `border-left:4px solid ${p.color.startsWith("--") ? `var(${p.color})` : p.color}`,
        onclick: () => { on.has(a.id) ? on.delete(a.id) : on.add(a.id); upd(); },
        onmouseenter: () => { hover = a.id; paint(); }, onmouseleave: () => { hover = -1; paint(); } },
        h("div", { class: "meta" }, `${a.id}. ${p.name} · ${D.dayNames[a.day]}`),
        h("div", null, a.title),
        h("div", { class: "tags" }, a.mentions.map(m => h("span", null, actorName(m)))));
      cards.append(c);
      return c;
    });
    function upd() {
      const arts = D.articles.filter(a => on.has(a.id)), pairs = cooc(arts);
      cardEls.forEach((c, i) => c.classList.toggle("off", !on.has(D.articles[i].id)));
      const edges = Object.entries(pairs).map(([k, l]) => { const [u, v] = k.split("|"); return { a: ids.indexOf(u), b: ids.indexOf(v), w: l.length }; });
      const E = edges.map(e => [e.a, e.b]), n = ids.length, m = edges.length, d = GK.degrees(n, E);
      const str = new Array(n).fill(0); edges.forEach(e => { str[e.a] += e.w; str[e.b] += e.w; });
      view.setGraph(ids.map((id, i) => ({ label: id, x: pos[id][0], y: pos[id][1], sub: actorName(id), badge: d[i] })), edges);
      const multi = edges.reduce((s, e) => s + e.w, 0);
      stats.innerHTML = "";
      [["bekapcsolt cikk", arts.length], ["$n$ (szereplő)", n], ["$m$ (él)", m], ["szereplőpár összesen", multi], ["$\\bar d$", fmt(2 * m / n)], ["sűrűség", fmt(m / binom2(n))]]
        .forEach(([l, v]) => stats.append(h("div", { class: "stat" }, h("div", { class: "v" }, String(v)), h("div", { class: "l" }, l))));
      const iso = ids.filter((_, i) => !d[i]).map(actorName);
      const order = ids.map((id, i) => [actorName(id), d[i], str[i]]).filter(x => x[1]).sort((a, b) => b[1] - a[1] || b[2] - a[2]);
      read.innerHTML = (order.length ? "Fokszám (erősség): " + order.map(([nm, dd, s]) => `${nm} ${dd} (${s})`).join(" · ") : "Nincs bekapcsolt cikk.") +
        (iso.length && arts.length ? `<br>Izolált (ezekben a cikkekben nem szerepel): ${iso.join(", ")}.` : "");
      math(stats);
      paint();
    }
    function paint() {
      view.hl.clear(); view.hlE.clear(); view.dim = hover > 0;
      if (hover > 0) {
        const a = D.articles.find(x => x.id === hover), I = a.mentions.map(m => ids.indexOf(m));
        I.forEach(i => view.hl.add(i));
        for (let x = 0; x < I.length; x++) for (let y = x + 1; y < I.length; y++) view.hlE.add(GK.edgeKey(I[x], I[y]));
      }
      view.draw();
    }
    upd();
  };

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
