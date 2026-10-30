  /* ==================================================================
     w1: 5.3 és 5.8 widgetjei (betweenness-paths, arvizhet-centrality, polblogs-hits)
     ================================================================== */
  {
    const inkFor = t => (t > 0.55 ? "#ffffff" : "--text");
    const fm = (x, d = 2) => fmt(x, d).replace("-", "−");
    /* tört kis nevezővel (köztességhez: ½, 1/3 …) */
    function frac(x, maxDen = 12) {
      if (Math.abs(x) < 1e-12) return "0";
      for (let q = 1; q <= maxDen; q++) { const p = Math.round(x * q); if (Math.abs(p / q - x) < 1e-9) return q === 1 ? String(p) : p + "/" + q; }
      return fmt(x, 2);
    }
    const onTheme = fn => new MutationObserver(fn).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    /* ------------------------------------------------------------------
       5.3  betweenness-paths – kin mennek át a legrövidebb utak?
       ------------------------------------------------------------------ */
    W["betweenness-paths"] = root => {
      header(root, "Kin megy át az út? – köztesség lépésről lépésre",
        "<b>Csúcs mód:</b> kattints egy csúcsra, és a táblázat felsorolja azokat a párokat, amelyek legrövidebb útja (vagy annak egy része) átmegy rajta – az összeg a köztessége. A sorra kattintva látod az utakat. " +
        "<b>Pár mód:</b> kattints két csúcsra, és megjelenik köztük az összes legrövidebb út; a belső csúcsok melletti tört a pár „rájuk eső” része.");
      const KEYS = [["arviz", "Árvízhét"], ["bowtie", "csokornyakkendő"], ["c4", "4 hosszú kör"], ["twoTri", "két háromszög + híd"], ["path5", "5 csúcsú út"], ["kite", "sárkány"]];
      let key = "arviz", mode = "node", G, sel = [], rowSel = -1, showAll = true;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      toggleGroup(ctr, KEYS, key, v => { key = v; load(); });
      toggleGroup(ctr2, [["node", "csúcs mód"], ["pair", "pár mód"]], mode, v => { mode = v; sel = []; rowSel = -1; paint(); });
      const cb = h("input", { type: "checkbox" }); cb.checked = true;
      cb.addEventListener("change", () => { showAll = cb.checked; paint(); });
      ctr2.append(h("label", null, cb, "köztesség minden csúcs mellett"));
      const box = h("div");
      root.append(box);
      const view = new GK.View(box, { aspect: 0.5, radius: 16, onNodeClick: i => click(i) });
      const read = h("div", { class: "readout" }), tbl = h("div", { class: "tw", style: "overflow-x:auto;max-height:22rem;overflow-y:auto" });
      root.append(read, tbl);
      onTheme(() => paint());

      function load() {
        const asp = key === "path5" ? 0.22 : key === "kite" ? 0.42 : 0.5;
        G = preset(key, asp); sel = []; rowSel = -1;
        if (key === "arviz") G.nodes.forEach(nd => { nd.y = 0.05 + nd.y * 0.86; delete nd.sub; });
        if (view.o.aspect !== asp) { view.o.aspect = asp; view.resize(); }
        paint();
      }
      function click(i) {
        if (mode === "node") { sel = sel[0] === i ? [] : [i]; rowSel = -1; }
        else { if (sel.length >= 2 || sel[0] === i) sel = []; else sel.push(i); }
        paint();
      }
      const L = i => G.nodes[i].label;
      const pathEdges = ps => { const s = new Set(); ps.forEach(p => p.forEach((v, k) => k && s.add(GK.edgeKey(p[k - 1], v)))); return s; };
      /* a v-n átmenő párok: [{s, t, through, all, paths}] */
      function pairsThrough(v) {
        const n = G.nodes.length, out = [];
        for (let s = 0; s < n; s++) for (let t = s + 1; t < n; t++) {
          if (s === v || t === v) continue;
          const P = shortestPaths(n, G.edges, s, t);
          const thr = P.filter(p => p.indexOf(v) > 0 && p.indexOf(v) < p.length - 1);
          if (thr.length) out.push({ s, t, through: thr.length, all: P.length, paths: thr });
        }
        return out;
      }
      function paint() {
        const n = G.nodes.length, btw = betweennessC(n, G.edges), mx = Math.max(1e-9, ...btw);
        let badge = btw.map(b => (showAll ? frac(b) : null)), hlE = new Set(), hl = new Set(sel), color = new Array(n).fill(null);
        if (showAll) btw.forEach((b, i) => { if (b > 0) color[i] = mixColor("--card", "--accent", 0.12 + 0.55 * b / mx); });
        let html = "", rows = "";
        if (mode === "node") {
          if (!sel.length) html = "Kattints egy csúcsra! A csúcsok melletti szám a köztességük (nyersen).";
          else {
            const v = sel[0], pr = pairsThrough(v), tot = pr.reduce((t, r) => t + r.through / r.all, 0);
            color[v] = GK.css("--accent");
            const pick = rowSel >= 0 && pr[rowSel] ? [pr[rowSel]] : pr;
            hlE = pathEdges(pick.flatMap(r => r.paths));
            pick.forEach(r => { hl.add(r.s); hl.add(r.t); });
            const np = (n - 1) * (n - 2) / 2;
            html = `<b>${L(v)}</b> köztessége: ${pr.map(r => frac(r.through / r.all)).join(" + ") || "0"} = <b>${frac(tot)}</b>` +
              ` &nbsp;·&nbsp; normálva: ${frac(tot)} / ${np} = <b>${fmt(tot / np, 2)}</b>` +
              (pr.length ? "" : "<br>Egyetlen legrövidebb út sem megy át rajta (végpontként nem számít).");
            rows = pr.map((r, k) => `<tr data-k="${k}" style="cursor:pointer${k === rowSel ? ";background:var(--bg-soft)" : ""}"><td>${L(r.s)}–${L(r.t)}</td><td>${r.all}</td><td>${r.through}</td><td><b>${frac(r.through / r.all)}</b></td>` +
              `<td>${r.paths.map(p => p.map(L).join("–")).join("; ")}</td></tr>`).join("");
            if (rows) rows = `<table><tr><th>pár</th><th>legrövidebb utak</th><th>ebből rajta át</th><th>rész</th><th>az átmenő utak</th></tr>${rows}</table>`;
          }
        } else {
          if (sel.length < 2) html = sel.length ? `Kezdőpont: <b>${L(sel[0])}</b>. Most kattints a végpontra!` : "Kattints két csúcsra (kezdőpont, végpont)!";
          else {
            const [s, t] = sel, P = shortestPaths(n, G.edges, s, t), share = new Array(n).fill(0);
            P.forEach(p => p.slice(1, -1).forEach(v => (share[v] += 1 / P.length)));
            hlE = pathEdges(P);
            P.forEach(p => p.forEach(v => hl.add(v)));
            badge = share.map(x => (x > 0 ? frac(x) : null));
            share.forEach((x, i) => { color[i] = x > 0 ? mixColor("--card", "--accent", 0.2 + 0.6 * x) : null; });
            const d = P.length ? P[0].length - 1 : Infinity;
            html = P.length ? `${L(s)} és ${L(t)} távolsága <b>${d}</b>, a legrövidebb utak száma $\\sigma = ${P.length}$. ` +
              (d === 1 ? "Szomszédosak: ez a pár senkinek sem ad köztességet." :
                "A belső csúcsok mellett a pár rájuk eső része: " + share.map((x, i) => (x > 0 ? `${L(i)}: ${frac(x)}` : null)).filter(Boolean).join(", ") + ".")
              : `${L(s)} és ${L(t)} között nincs út.`;
            rows = P.length ? `<table><tr><th>#</th><th>út</th></tr>${P.map((p, k) => `<tr><td>${k + 1}</td><td>${p.map(L).join("–")}</td></tr>`).join("")}</table>` : "";
          }
        }
        view.setGraph(G.nodes.map((nd, i) => ({ ...nd, color: color[i], ink: color[i] ? (i === sel[0] && mode === "node" ? "#ffffff" : "--text") : null, badge: badge[i] })), G.edges.map(e => ({ ...e, w: 1 })));
        view.hl = hl; view.hlE = hlE; view.dim = hlE.size > 0;
        view.draw();
        read.innerHTML = html; tbl.innerHTML = rows; math(read);
        tbl.querySelectorAll("tr[data-k]").forEach(tr => tr.addEventListener("click", () => { const k = +tr.dataset.k; rowSel = rowSel === k ? -1 : k; paint(); }));
      }
      load();
    };

    /* ------------------------------------------------------------------
       5.8  arvizhet-centrality – a teljes hét és a négy lap egymás mellett
       ------------------------------------------------------------------ */
    W["arvizhet-centrality"] = root => {
      header(root, "Árvízhét: ki a központi – lapokra bontva?",
        "Válassz centralitást! Felül a teljes hét szereplőgráfja, alatta a négy lap saját gráfja (csak a lap cikkeiből). A csúcs színe és a mellette álló szám a centralitás; a kerettel jelölt csúcs a győztes. " +
        "A szürke csúcsok az adott lapban nem szerepelnek.");
      const MEAS = [["deg", "fokszám"], ["str", "erősség"], ["clo", "közelségi"], ["btw", "köztesség"], ["eig", "sajátvektor"], ["pr", "PageRank"]];
      let meas = "btw";
      const ctr = h("div", { class: "controls" });
      root.append(ctr);
      toggleGroup(ctr, MEAS, meas, v => { meas = v; paint(); });
      const ids = D.actors.map(a => a.id);
      /* egy lap (vagy a teljes hét) súlyozott szereplőgráfja: csak a jelen lévő szereplők */
      function graphOf(paper) {
        const w = {}, present = new Set();
        D.articles.filter(a => !paper || a.paper === paper).forEach(a => {
          a.mentions.forEach(m => present.add(m));
          for (let i = 0; i < a.mentions.length; i++) for (let j = i + 1; j < a.mentions.length; j++) {
            const x = ids.indexOf(a.mentions[i]), y = ids.indexOf(a.mentions[j]), k = Math.min(x, y) + "-" + Math.max(x, y);
            w[k] = (w[k] || 0) + 1;
          }
        });
        const sub = ids.map((id, i) => i).filter(i => present.has(ids[i])), loc = {};
        sub.forEach((g, k) => (loc[g] = k));
        const edges = Object.entries(w).map(([k, v]) => { const [a, b] = k.split("-").map(Number); return { a: loc[a], b: loc[b], w: v, ga: a, gb: b }; });
        return { sub, edges };
      }
      function values(g) {
        const n = g.sub.length, E = g.edges;
        if (meas === "deg") return degreeC(n, E).map(d => d / Math.max(1, n - 1));
        if (meas === "str") return degreeC(n, E, { weighted: true });
        if (meas === "clo") return closenessC(n, E);
        if (meas === "btw") return betweennessC(n, E);
        if (meas === "eig") return eigenC(n, E).vec;
        return pagerankC(n, E);
      }
      const digits = () => (meas === "pr" ? 3 : 2);
      const PANELS = [[null, "Teljes hét (12 cikk)"]].concat(D.papers.map(p => [p.id, p.name + " (3 cikk)"]));
      const grid = h("div", { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:.6rem;margin-top:.4rem" });
      const big = h("div");
      root.append(big, grid);
      const views = PANELS.map(([pid, title], k) => {
        const wrap = h("div", { style: "border:1px solid var(--border);border-radius:10px;padding:.3rem .4rem" });
        const cap = h("div", { style: "font-size:.85rem;font-weight:600;color:var(--muted)" }, title);
        const holder = h("div");
        wrap.append(cap, holder);
        (k === 0 ? big : grid).append(wrap);
        const v = new GK.View(holder, { aspect: k === 0 ? (root.clientWidth < 500 ? 0.62 : 0.45) : 0.6, radius: k === 0 ? 16 : 12, draggable: false, showWeights: false });
        return { pid, v, cap, title };
      });
      const read = h("div", { class: "readout" });
      root.append(read);
      onTheme(() => paint());
      const P = GK.normalize(ids.map(i => ACTOR_POS[i]), 0.5);
      function paint() {
        const lines = [];
        views.forEach(({ pid, v, cap, title }, k) => {
          const g = graphOf(pid), val = values(g), mx = Math.max(1e-12, ...val.map(Math.abs));
          const best = Math.max(...val), win = [...g.sub.keys()].filter(j => Math.abs(val[j] - best) < 1e-9);
          const allEq = win.length === g.sub.length;
          const nodes = ids.map((id, i) => {
            const j = g.sub.indexOf(i), y = 0.05 + P[i][1] * (k === 0 ? 0.86 : 0.82);
            if (j < 0) return { label: id, x: P[i][0], y, color: mixColor("--card", "--border", 0.5), ink: "--muted" };
            const t = mx > 0 ? val[j] / mx : 0, c = mixColor("--card", "--accent", 0.12 + 0.7 * t);
            return { label: id, x: P[i][0], y, color: c, ink: inkFor(t), badge: fm(val[j], digits()) };
          });
          v.setGraph(nodes, g.edges.map(e => ({ a: e.ga, b: e.gb, w: e.w })));
          v.hl = new Set(allEq ? [] : win.map(j => g.sub[j])); v.dim = false;
          v.draw();
          const names = win.map(j => ids[g.sub[j]]).join(", ");
          cap.textContent = title;
          lines.push(`${pid || "Teljes hét"}: ${allEq ? "mindenki egyforma (" + fm(best, digits()) + ")" : "<b>" + names + "</b> (" + fm(best, digits()) + ")"}`);
        });
        read.innerHTML = "Győztes – " + lines.join(" &nbsp;·&nbsp; ") +
          (meas === "btw" ? "<br>A köztesség nyers érték (párok száma). A háromszögben (RH, NY) senkin sem megy át út." : "") +
          (meas === "eig" || meas === "pr" ? "<br>Kis gráfon a sajátvektor és a PageRank is a fokszámot követi – a különbség a teljes héten látszik." : "");
      }
      paint();
    };

    /* ------------------------------------------------------------------
       5.8  polblogs-hits – 1222 politikai blog: befok, PageRank, HITS
       ------------------------------------------------------------------ */
    W["polblogs-hits"] = root => {
      const PB = window.POLBLOGS;
      header(root, "Politikai blogok (2005): ki a fontos – és melyik táborból?",
        "1222 blog, 19&#8239;021 link (Adamic–Glance). <span style='color:#2563eb'>●</span> liberális, <span style='color:#dc2626'>●</span> konzervatív. A pötty mérete a választott mérőszám. " +
        "Kattints egy pöttyre a nevéért és a linkjeiért; a táblázat a 10 legjobbat mutatja.");
      if (!PB) { root.append(h("p", { class: "muted" }, "Az adatfájl (polblogs-data.js) nem töltődött be.")); return; }
      const MEAS = [["indeg", "befok"], ["pr", "PageRank"], ["auth", "HITS-tekintély"], ["hub", "HITS-hub"], ["outdeg", "kifok"]];
      let meas = "pr", edgeMode = "all", sel = -1;
      const ctr = h("div", { class: "controls" }), ctr2 = h("div", { class: "controls" });
      root.append(ctr, ctr2);
      toggleGroup(ctr, MEAS, meas, v => { meas = v; sel = -1; drawEdges(); paint(); });
      toggleGroup(ctr2, [["all", "minden link"], ["cross", "csak a táborok között"], ["none", "linkek nélkül"]], edgeMode, v => { edgeMode = v; drawEdges(); paint(); });
      const holder = h("div", { style: "position:relative" });
      root.append(holder);
      const cv = h("canvas", { style: "display:block;touch-action:manipulation;border-radius:8px;background:var(--bg-soft)" });
      holder.append(cv);
      const read = h("div", { class: "readout" }), tbl = h("div", { class: "tw", style: "overflow-x:auto" });
      root.append(read, tbl);
      const n = PB.n, X = new Float32Array(n), Y = new Float32Array(n), E = PB.edges, COL = ["#2563eb", "#dc2626"];
      const off = document.createElement("canvas");
      let W0 = 0, H0 = 0, dpr = 1;
      function size() {
        const st = getComputedStyle(root), inner = root.clientWidth - parseFloat(st.paddingLeft || 0) - parseFloat(st.paddingRight || 0);
        W0 = Math.min(760, Math.max(260, inner)); H0 = Math.round(W0 * 0.7); dpr = window.devicePixelRatio || 1;
        [cv, off].forEach(c => { c.width = Math.round(W0 * dpr); c.height = Math.round(H0 * dpr); });
        cv.style.width = W0 + "px"; cv.style.height = H0 + "px";
        const pad = 12;
        for (let i = 0; i < n; i++) { X[i] = pad + PB.xy[2 * i] * (W0 - 2 * pad); Y[i] = pad + PB.xy[2 * i + 1] * (H0 - 2 * pad); }
        drawEdges(); paint();
      }
      const val = () => PB[meas];
      function radius() {
        const v = val(), mx = Math.max(...v);
        return v.map(x => 1.2 + 9 * Math.sqrt(Math.max(0, x) / mx));
      }
      function drawEdges() {
        if (!W0) return;
        const c = off.getContext("2d");
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W0, H0);
        if (edgeMode === "none") return;
        c.lineWidth = 0.5;
        for (const side of [0, 1, 2]) {                    // 0: lib→lib, 1: kons→kons, 2: táborok között
          if (edgeMode === "cross" && side < 2) continue;
          c.strokeStyle = side === 2 ? "#a855f7" : COL[side];
          c.globalAlpha = edgeMode === "cross" ? 0.18 : side === 2 ? 0.08 : 0.035;
          c.beginPath();
          for (let k = 0; k < E.length; k += 2) {
            const a = E[k], b = E[k + 1], la = PB.lean[a], lb = PB.lean[b];
            const s = la !== lb ? 2 : la;
            if (s !== side) continue;
            c.moveTo(X[a], Y[a]); c.lineTo(X[b], Y[b]);
          }
          c.stroke();
        }
        c.globalAlpha = 1;
      }
      function topK(k = 10) { const v = val(); return [...Array(n).keys()].sort((i, j) => v[j] - v[i]).slice(0, k); }
      function paint() {
        if (!W0) return;
        const c = cv.getContext("2d");
        c.setTransform(dpr, 0, 0, dpr, 0, 0);
        c.clearRect(0, 0, W0, H0);
        c.drawImage(off, 0, 0, W0, H0);
        const r = radius(), top = topK(), topSet = new Set(top), order = [...Array(n).keys()].sort((i, j) => r[i] - r[j]);
        if (sel >= 0) {                                    // a kijelölt blog linkjei
          c.lineWidth = 1.2; c.globalAlpha = 0.6;
          for (let k = 0; k < E.length; k += 2) {
            const a = E[k], b = E[k + 1];
            if (a !== sel && b !== sel) continue;
            c.strokeStyle = a === sel ? GK.css("--text") : "#a855f7";
            c.beginPath(); c.moveTo(X[a], Y[a]); c.lineTo(X[b], Y[b]); c.stroke();
          }
          c.globalAlpha = 1;
        }
        for (const i of order) {
          c.beginPath(); c.arc(X[i], Y[i], r[i], 0, 2 * Math.PI);
          c.fillStyle = COL[PB.lean[i]]; c.globalAlpha = topSet.has(i) || i === sel ? 0.95 : 0.55; c.fill();
          if (topSet.has(i) || i === sel) { c.globalAlpha = 1; c.lineWidth = i === sel ? 2.5 : 1.2; c.strokeStyle = GK.css("--text"); c.stroke(); }
        }
        c.globalAlpha = 1;
        const kons = top.filter(i => PB.lean[i] === 1).length, v = val(), d = meas === "indeg" || meas === "outdeg" ? 0 : 4;
        const name = i => PB.names[i].trim();
        let html = `A 10 legjobb között <b>${kons}</b> konzervatív és <b>${10 - kons}</b> liberális blog.`;
        if (meas === "auth" || meas === "hub") html += " A HITS a sűrűbben összekötött (liberális) táborra „ül rá”: a domináns sajátvektor egy közösségre fókuszál.";
        if (meas === "pr" || meas === "indeg") html += " A befok és a PageRank majdnem ugyanazt a listát adja (a top 10-ből 9 közös).";
        if (edgeMode === "cross") html += " Csak a linkek 8,8%-a fut a két tábor között.";
        if (sel >= 0) {
          const outs = [], ins = [];
          for (let k = 0; k < E.length; k += 2) { if (E[k] === sel) outs.push(E[k + 1]); if (E[k + 1] === sel) ins.push(E[k]); }
          const cross = l => l.filter(j => PB.lean[j] !== PB.lean[sel]).length;
          html += `<br><b>${name(sel)}</b> (${PB.lean[sel] ? "konzervatív" : "liberális"}): befok ${PB.indeg[sel]} (ebből a másik táborból ${cross(ins)}), kifok ${PB.outdeg[sel]} (a másik táborba ${cross(outs)}); ` +
            `PageRank ${fmt(PB.pr[sel], 4)}, tekintély ${fmt(PB.auth[sel], 4)}, hub ${fmt(PB.hub[sel], 4)}.`;
        }
        read.innerHTML = html;
        tbl.innerHTML = `<table><tr><th>#</th><th>blog</th><th>tábor</th><th>${MEAS.find(m => m[0] === meas)[1]}</th></tr>` +
          top.map((i, k) => `<tr data-i="${i}" style="cursor:pointer${i === sel ? ";background:var(--bg-soft)" : ""}"><td>${k + 1}</td><td>${name(i)}</td>` +
            `<td><span style="color:${COL[PB.lean[i]]}">●</span> ${PB.lean[i] ? "K" : "L"}</td><td>${fmt(v[i], d)}</td></tr>`).join("") + "</table>";
        tbl.querySelectorAll("tr[data-i]").forEach(tr => tr.addEventListener("click", () => { const i = +tr.dataset.i; sel = sel === i ? -1 : i; paint(); }));
      }
      cv.addEventListener("click", ev => {
        const b = cv.getBoundingClientRect(), x = ev.clientX - b.left, y = ev.clientY - b.top, r = radius();
        let best = -1, bd = Infinity;
        for (let i = 0; i < n; i++) { const d = Math.hypot(X[i] - x, Y[i] - y) - r[i]; if (d < bd) { bd = d; best = i; } }
        sel = bd < 8 && best !== sel ? best : -1;
        paint();
      });
      let rT;
      addEventListener("resize", () => { clearTimeout(rT); rT = setTimeout(size, 150); });
      onTheme(() => paint());
      size();
    };
  }
