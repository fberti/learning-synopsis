
  /* ------------------------------------------------------------------
     2.1  path-enumerator – utak, körök, séták felsorolása
     ------------------------------------------------------------------ */
  const G21 = { edges: "A-B,A-C,B-C,B-D,C-D,D-E,E-F", pos: { A: [0, 0.5], B: [1, 0], C: [1, 1], D: [2, 0.5], E: [3, 0.5], F: [4, 0.5] } };
  function smallGraph(str, posMap, aspect) {
    const g = GK.parseEdges(str);
    const P = GK.normalize(g.labels.map(l => posMap[l]), aspect);
    return { labels: g.labels, nodes: g.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), edges: g.edges.map(([a, b]) => ({ a, b })) };
  }

  W["path-enumerator"] = root => {
    header(root, "Utak, körök és séták felsorolása",
      "Kattints egy csúcsra (kezdőpont), majd egy másikra (végpont)! A gép felsorolja a köztük vezető utakat vagy a megadott hosszú sétákat. A listában egy elemre kattintva kiemeli a gráfon.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    let mode = "path", k = 3, data = "g21";
    toggleGroup(ctr, [["path", "Utak"], ["walk", "Séták"], ["cycle", "Körök"]], mode, v => { mode = v; list(); });
    const kSl = h("input", { type: "range", min: 1, max: 6, step: 1, value: k, oninput: () => { k = +kSl.value; kLab.textContent = k; list(); } });
    const kLab = h("b", null, String(k));
    const kWrap = h("label", null, "séta hossza: ", kLab, " ", kSl);
    ctr.append(kWrap);
    const ctr2 = h("div", { class: "controls" });
    root.append(ctr2);
    toggleGroup(ctr2, [["g21", "a 2.1 gráfja"], ["arviz", "Árvízhét"]], data, v => { data = v; load(); });
    const box = h("div");
    root.append(box);
    const read = h("div", { class: "readout" });
    const lst = h("div", { style: "display:flex;flex-wrap:wrap;gap:.3rem;margin:.4rem 0" });
    root.append(read, lst);
    let s = -1, t = -1, L = [];
    const view = new GK.View(box, { aspect: 0.42, radius: 16, onNodeClick: i => {
      if (s < 0 || (s >= 0 && t >= 0)) { s = i; t = -1; } else if (i !== s) t = i;
      list();
    } });
    function load() {
      s = -1; t = -1;
      if (data === "g21") { const g = smallGraph(G21.edges, G21.pos, 0.42); view.setGraph(g.nodes, g.edges); }
      else { const g = arvizGraph(0.42); view.setGraph(g.nodes.map(n => ({ ...n, sub: "" })), g.edges.map(e => ({ a: e.a, b: e.b }))); }
      L = GK.adjList(view.nodes.length, view.edgeList());
      if (data === "g21") { s = 0; t = 5; }
      list();
    }
    function enumPaths(a, b, limit = 200) {
      const out = [], seen = new Set([a]);
      (function go(p) {
        if (out.length >= limit) return;
        const u = p[p.length - 1];
        if (u === b) { out.push(p.slice()); return; }
        L[u].forEach(v => { if (!seen.has(v)) { seen.add(v); p.push(v); go(p); p.pop(); seen.delete(v); } });
      })([a]);
      return out;
    }
    function enumWalks(a, b, len, limit = 60) {
      const out = []; let count = 0;
      (function go(p) {
        if (p.length - 1 === len) { if (p[p.length - 1] === b) { count++; if (out.length < limit) out.push(p.slice()); } return; }
        L[p[p.length - 1]].forEach(v => { p.push(v); go(p); p.pop(); });
      })([a]);
      return { out, count };
    }
    function enumCycles() {
      const n = view.nodes.length, out = [], keys = new Set();
      for (let s0 = 0; s0 < n; s0++) {
        const seen = new Set([s0]);
        (function go(p) {
          const u = p[p.length - 1];
          L[u].forEach(v => {
            if (v === s0 && p.length >= 3) {
              const c = p.slice(), key = c.slice().sort((x, y) => x - y).join(",") + "|" + edgeSetKey(c);
              if (!keys.has(key)) { keys.add(key); out.push(c.concat([s0])); }
            } else if (!seen.has(v) && v > s0) { seen.add(v); p.push(v); go(p); p.pop(); seen.delete(v); }
          });
        })([s0]);
      }
      return out;
    }
    function edgeSetKey(c) { const e = []; for (let i = 0; i < c.length; i++) e.push(GK.edgeKey(c[i], c[(i + 1) % c.length])); return e.sort().join(";"); }
    const name = p => p.map(i => view.nodes[i].label).join(", ");
    function show(p) {
      view.hl.clear(); view.hlE.clear(); view.dim = !!p;
      if (p) { p.forEach(i => view.hl.add(i)); for (let i = 0; i + 1 < p.length; i++) view.hlE.add(GK.edgeKey(p[i], p[i + 1])); }
      view.nodes.forEach((nd, i) => (nd.color = i === s ? "--setA" : i === t ? "--setB" : null));
      view.draw();
    }
    function list() {
      kWrap.style.display = mode === "walk" ? "" : "none";
      lst.innerHTML = "";
      let items = [];
      if (mode === "cycle") {
        items = enumCycles();
        read.innerHTML = `A gráfban <b>${items.length}</b> kör van (minden kört egyszer számolunk, kezdőponttól és iránytól függetlenül).`;
      } else if (s < 0 || t < 0) {
        read.innerHTML = s < 0 ? "Kattints a kezdőcsúcsra!" : `Kezdőpont: <b>${view.nodes[s].label}</b>. Most kattints a végpontra!`;
      } else if (mode === "path") {
        items = enumPaths(s, t);
        const lens = items.map(p => p.length - 1), mn = Math.min(...lens);
        read.innerHTML = `<b>${view.nodes[s].label}</b> → <b>${view.nodes[t].label}</b>: <b>${items.length}</b> út` +
          (items.length ? `, a legrövidebb hossza <b>${mn}</b> (ez a távolság). Hosszak: ${lens.slice().sort((a, b) => a - b).join(", ")}.` : " – a két csúcs nem összeköthető.");
      } else {
        const r = enumWalks(s, t, k);
        items = r.out;
        read.innerHTML = `<b>${view.nodes[s].label}</b> → <b>${view.nodes[t].label}</b>: <b>${r.count}</b> darab ${k} hosszú séta` + (r.count > items.length ? ` (az első ${items.length} látszik)` : "") +
          ". A séták ismételhetnek csúcsot és élt is. (A 2.7-ben a szomszédsági mátrix hatványa ugyanezt a számot adja.)";
      }
      items.forEach(p => {
        const b = btn(name(p), () => { [...lst.children].forEach(x => x.classList.remove("on")); b.classList.add("on"); show(p); });
        lst.append(b);
      });
      show(null);
    }
    load();
  };

  /* ------------------------------------------------------------------
     2.2  components – komponensek, elvágó csúcs, híd
     ------------------------------------------------------------------ */
  W["components"] = root => {
    header(root, "Komponensek, elvágó csúcsok, hidak",
      "Kattints egy csúcsra: kihagyod (és újra kattintva visszaveszed). Kattints egy élre: törlöd vagy visszaállítod. A színek a komponenseket jelölik. A lapokat ki-be kapcsolva azt is látod, mely cikkekből áll össze a hálózat.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    const papersOn = new Set(D.papers.map(p => p.id));
    D.papers.forEach(p => {
      const cb = h("input", { type: "checkbox", checked: "", onchange: () => { cb.checked ? papersOn.add(p.id) : papersOn.delete(p.id); build(); } });
      ctr.append(h("label", null, cb, " " + p.name));
    });
    const ctr2 = h("div", { class: "controls" });
    root.append(ctr2);
    let showCut = false;
    const cutBtn = btn("Mutasd az elvágó csúcsokat és hidakat", () => { showCut = !showCut; cutBtn.classList.toggle("on", showCut); paint(); });
    ctr2.append(cutBtn, btn("Visszaállítás", () => { removedN.clear(); removedE.clear(); paint(); }));
    const box = h("div");
    root.append(box);
    const read = h("div", { class: "readout" });
    root.append(read);
    const removedN = new Set(), removedE = new Set();
    const pos = actorPositions(0.5), ids = D.actors.map(a => a.id);
    let allEdges = [];
    const view = new GK.View(box, { aspect: 0.5, radius: 17, onNodeClick: i => { removedN.has(i) ? removedN.delete(i) : removedN.add(i); paint(); },
      onDraw: (ctx, v) => {                           // a törölt élek szaggatottan
        ctx.save(); ctx.setLineDash([5, 5]); ctx.strokeStyle = GK.css("--border"); ctx.lineWidth = 1.5;
        allEdges.forEach(e => {
          if (!removedE.has(GK.edgeKey(e.a, e.b))) return;
          const [x1, y1] = v.px(v.nodes[e.a]), [x2, y2] = v.px(v.nodes[e.b]), d = Math.hypot(x2 - x1, y2 - y1) || 1, r = v.o.radius + 2;
          ctx.beginPath(); ctx.moveTo(x1 + (x2 - x1) * r / d, y1 + (y2 - y1) * r / d); ctx.lineTo(x2 - (x2 - x1) * r / d, y2 - (y2 - y1) * r / d); ctx.stroke();
        });
        ctx.restore();
      } });
    view.c.addEventListener("click", ev => {
      const r = view.c.getBoundingClientRect(), x = ev.clientX - r.left, y = ev.clientY - r.top;
      if (view._hitNode(x, y) >= 0) return;
      let best = null, bd = 8;
      allEdges.forEach(e => {
        const [x1, y1] = view.px(view.nodes[e.a]), [x2, y2] = view.px(view.nodes[e.b]);
        const dx = x2 - x1, dy = y2 - y1, L2 = dx * dx + dy * dy || 1, tt = Math.max(0, Math.min(1, ((x - x1) * dx + (y - y1) * dy) / L2));
        const dd = Math.hypot(x - x1 - tt * dx, y - y1 - tt * dy);
        if (dd < bd) { bd = dd; best = e; }
      });
      if (best) { const kk = GK.edgeKey(best.a, best.b); removedE.has(kk) ? removedE.delete(kk) : removedE.add(kk); paint(); }
    });
    function build() {
      const pairs = cooc(D.articles.filter(a => papersOn.has(a.paper)));
      allEdges = Object.keys(pairs).map(k => { const [u, v] = k.split("|"); return { a: ids.indexOf(u), b: ids.indexOf(v) }; });
      removedE.clear();
      paint();
    }
    const activeEdges = () => allEdges.filter(e => !removedE.has(GK.edgeKey(e.a, e.b)) && !removedN.has(e.a) && !removedN.has(e.b));
    function paint() {
      const n = ids.length, E = activeEdges().map(e => [e.a, e.b]);
      const { comp, count } = componentsOf(n, E, removedN);
      let cuts = [], bridges = [];
      if (showCut) {
        ids.forEach((_, v) => {
          if (removedN.has(v)) return;
          const rm = new Set(removedN); rm.add(v);
          if (componentsOf(n, E.filter(([a, b]) => a !== v && b !== v), rm).count > count) cuts.push(v);
        });
        E.forEach((e, i) => { if (componentsOf(n, E.filter((_, j) => j !== i), removedN).count > count) bridges.push(e); });
      }
      view.setGraph(ids.map((id, i) => ({ label: id, x: pos[id][0], y: pos[id][1],
        color: removedN.has(i) ? null : COMP_COLORS[comp[i] % COMP_COLORS.length], sub: removedN.has(i) ? "kihagyva" : actorName(id) })),
        activeEdges().map(e => ({ a: e.a, b: e.b })));
      view.hl.clear(); view.hlE.clear(); view.dim = false;
      cuts.forEach(v => view.hl.add(v));
      bridges.forEach(([a, b]) => view.hlE.add(GK.edgeKey(a, b)));
      view.draw();
      const groups = [];
      for (let c = 0; c < count; c++) groups.push(ids.filter((_, i) => comp[i] === c).join(", "));
      read.innerHTML = `<b>${count}</b> komponens: ` + groups.map(g => `{${g}}`).join(" · ") +
        (showCut ? `<br>Elvágó csúcs: <b>${cuts.map(v => ids[v]).join(", ") || "nincs"}</b> (vastag keret) · híd: <b>${bridges.map(([a, b]) => ids[a] + "–" + ids[b]).join(", ") || "nincs"}</b> (kiemelt él)` : "");
    }
    build();
  };

  /* ------------------------------------------------------------------
     2.3  bfs-animator – szélességi bejárás lépésenként
     ------------------------------------------------------------------ */
  W["bfs-animator"] = root => {
    header(root, "Szélességi bejárás lépésenként",
      "Kattints egy csúcsra: onnan indul a bejárás. A „Lépés” gomb mindig kivesz egy csúcsot a sor elejéről, és felfedezi az új szomszédait. A csúcsok mellett a távolság, a kiemelt élek a BFS-fa élei.");
    const ctr = h("div", { class: "controls" });
    root.append(ctr);
    let data = "arviz";
    toggleGroup(ctr, [["arviz", "Árvízhét"], ["g21", "a 2.1 gráfja"], ["c6", "$C_6$"], ["two", "két háromszög"]], data, v => { data = v; load(); });
    const ctr2 = h("div", { class: "controls" });
    root.append(ctr2);
    ctr2.append(btn("Lépés", () => step()), btn("Végig", () => { while (q.length) step(true); paint(); }), btn("Újra", () => start(s)));
    const box = h("div");
    root.append(box);
    const qLine = h("div", { class: "readout" });
    const tbl = h("div", { class: "tw", style: "overflow-x:auto" });
    root.append(qLine, tbl);
    const view = new GK.View(box, { aspect: 0.46, radius: 16, onNodeClick: i => start(i) });
    let L = [], dist = [], par = [], q = [], s = 0, rows = [];
    function load() {
      if (data === "arviz") { const g = arvizGraph(0.46); view.setGraph(g.nodes.map(n => ({ ...n, sub: "" })), g.edges.map(e => ({ a: e.a, b: e.b }))); s = ids("Kl"); }
      else if (data === "g21") { const g = smallGraph(G21.edges, G21.pos, 0.46); view.setGraph(g.nodes, g.edges); s = 0; }
      else {
        const str = data === "c6" ? "1-2,2-3,3-4,4-5,5-6,6-1" : "a-b,b-c,c-a,d-e,e-f,f-d";
        const g = GK.parseEdges(str), P = data === "c6" ? GK.circleLayout(6).map(p => [0.5 + (p[0] - 0.5) * 0.55, 0.05 + p[1] * 0.9])
          : GK.normalize([[0, 0], [1, 0], [0.5, 0.85], [2.2, 0], [3.2, 0], [2.7, 0.85]], 0.46);
        view.setGraph(g.labels.map((l, i) => ({ label: l, x: P[i][0], y: P[i][1] })), g.edges.map(([a, b]) => ({ a, b }))); s = 0;
      }
      L = GK.adjList(view.nodes.length, view.edgeList());
      start(s);
    }
    function ids(l) { return view.nodes.findIndex(n => n.label === l); }
    function start(i) {
      s = i; const n = view.nodes.length;
      dist = new Array(n).fill(Infinity); par = new Array(n).fill(-1); dist[s] = 0; q = [s];
      rows = [[0, "–", `${view.nodes[s].label} (0)`, view.nodes[s].label]];
      paint();
    }
    function step(silent) {
      if (!q.length) return;
      const u = q.shift(), nw = [];
      L[u].forEach(v => { if (dist[v] === Infinity) { dist[v] = dist[u] + 1; par[v] = u; q.push(v); nw.push(v); } });
      rows.push([rows.length, view.nodes[u].label, nw.map(v => `${view.nodes[v].label} (${dist[v]})`).join(", ") || "–", q.map(v => view.nodes[v].label).join(", ") || "(üres)"]);
      if (!silent) paint();
    }
    const LAYER = ["--accent", "--setA", "--setC", "--setB", "#a855f7", "#ef4444", "#14b8a6"];
    function paint() {
      view.nodes.forEach((nd, i) => { nd.badge = dist[i] === Infinity ? "∞" : dist[i]; nd.color = dist[i] === Infinity ? null : LAYER[Math.min(dist[i], LAYER.length - 1)]; });
      view.hl.clear(); view.hlE.clear(); view.dim = false;
      par.forEach((p, v) => { if (p >= 0) view.hlE.add(GK.edgeKey(p, v)); });
      q.forEach(v => view.hl.add(v));
      view.draw();
      const done = !q.length, fin = dist.filter(x => x !== Infinity);
      qLine.innerHTML = `Sor: <b>[${q.map(v => view.nodes[v].label).join(", ")}]</b>` + (done ? ` – kész. A(z) <b>${view.nodes[s].label}</b> excentricitása (a legnagyobb véges távolság) <b>${Math.max(...fin)}</b>` +
        (fin.length < dist.length ? `; ${dist.length - fin.length} csúcs nem érhető el (∞)` : "") + "." : " (vastag keret: a sorban várakozók)");
      tbl.innerHTML = "<table><tr><th>lépés</th><th>kivesszük</th><th>új csúcsok (távolság)</th><th>a sor utána</th></tr>" +
        rows.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td><td>${r[2]}</td><td>${r[3]}</td></tr>`).join("") + "</table>";
    }
    load();
    math(ctr);
  };
