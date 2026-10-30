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
